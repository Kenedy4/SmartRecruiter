from datetime import datetime
from flask_sqlalchemy import SQLAlchemy #type: ignore
from flask_bcrypt import Bcrypt #type: ignore
from sqlalchemy import func, Enum, MetaData #type: ignore
# from flask_serializer import SerializerMixin #type: ignore

# Naming convention for PostgreSQL
metadata = MetaData(naming_convention={
    "pk": "pk_%(table_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ix": "ix_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s"
})

# Initialize extensions
db = SQLAlchemy(metadata=metadata)
bcrypt = Bcrypt()

class TimestampMixin:
    """Mixin for adding timestamp fields to models."""
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class User(db.Model, TimestampMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    role = db.Column(Enum('recruiter', 'interviewee', name="user_roles"), nullable=False)
    gender = db.Column(Enum('male', 'female', 'other', name="gender_types"), nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    company_name = db.Column(db.String(100), nullable=True)  # Recruiter-specific
    consent = db.Column(db.Boolean, nullable=True, default=False)  # Interviewee-specific

    # Relationships
    assessments = db.relationship('Assessment', backref='recruiter', lazy="select")
    submissions = db.relationship('Submission', backref='interviewee', lazy="dynamic")
    notifications = db.relationship('Notification', backref='user', lazy="select")

    def average_score(self):
        """
        Calculate the average score for the interviewee from their submissions.
        """
        if self.role != 'interviewee':
            return None

        # Query the submissions for the user and calculate the average score
        total_scores = sum([submission.score for submission in self.submissions if submission.score is not None])
        count = len([submission for submission in self.submissions if submission.score is not None])
        return round(total_scores / count, 2) if count > 0 else 0

    def to_dict(self):
        """
        Serialize User object to a dictionary format, including the average score for interviewees.
        """
        return {
            'id': self.id,
            'username': self.username,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'email': self.email,
            'role': self.role,
            'gender': self.gender,
            'company_name': self.company_name,
            'consent': self.consent,
            'average_score': self.average_score() if self.role == 'interviewee' else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PasswordReset(db.Model, TimestampMixin):
    __tablename__ = "password_resets"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    token = db.Column(db.String(100), unique=True, nullable=False)
    expires_at = db.Column(db.DateTime, nullable=False)
    used = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'token': self.token,
            'expires_at': self.expires_at.isoformat() if self.expires_at else None,
            'used': self.used
        }

class Assessment(db.Model, TimestampMixin):
    __tablename__ = "assessments"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    time_limit = db.Column(db.Integer, nullable=False)  # Time in minutes
    is_published = db.Column(db.Boolean, default=False)

        # Relationships
    questions = db.relationship('Question', backref='assessment', lazy="dynamic")
    invitations = db.relationship('Invitation', backref='assessment', lazy="dynamic")
    submissions = db.relationship('Submission', backref='assessment', lazy="dynamic")
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'recruiter_id': self.recruiter_id,
            'time_limit': self.time_limit,
            'is_published': self.is_published,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Question(db.Model, TimestampMixin):
    __tablename__ = "questions"

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'), nullable=False)
    type = db.Column(db.Enum('multiple_choice', 'subjective', 'coding', name="question_types"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    choices = db.Column(db.JSON, nullable=True)
    correct_answer = db.Column(db.Text, nullable=True)

        # Relationships
    answers = db.relationship('Answer', backref='question', lazy="dynamic")
    feedback = db.relationship('Feedback', backref='question', lazy="dynamic")
    def to_dict(self):
        return {
            'id': self.id,
            'assessment_id': self.assessment_id,
            'type': self.type,
            'text': self.text,
            'choices': self.choices,
            'correct_answer': self.correct_answer,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Invitation(db.Model, TimestampMixin):
    __tablename__ = "invitations"

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'), nullable=False)
    interviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('pending', 'accepted', 'completed', 'expired', name="invitation_status"), default='pending')
    expiry_date = db.Column(db.DateTime, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'assessment_id': self.assessment_id,
            'interviewee_id': self.interviewee_id,
            'status': self.status,
            'expiry_date': self.expiry_date.isoformat() if self.expiry_date else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Submission(db.Model, TimestampMixin):
    __tablename__ = "submissions"

    id = db.Column(db.Integer, primary_key=True)
    assessment_id = db.Column(db.Integer, db.ForeignKey('assessments.id'), nullable=False)
    interviewee_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    status = db.Column(db.Enum('in_progress', 'submitted', 'graded', name="submission_status"), default='in_progress')
    score = db.Column(db.Float, nullable=True)
    submitted_at = db.Column(db.DateTime, nullable=True)

        # Relationships
    answers = db.relationship('Answer', backref='submission', lazy="dynamic")
    feedback = db.relationship('Feedback', backref='submission', lazy="dynamic")
    def to_dict(self):
        return {
            'id': self.id,
            'assessment_id': self.assessment_id,
            'interviewee_id': self.interviewee_id,
            'status': self.status,
            'score': self.score,
            'submitted_at': self.submitted_at.isoformat() if self.submitted_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Answer(db.Model, TimestampMixin):
    __tablename__ = "answers"

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=False)
    answer_text = db.Column(db.Text, nullable=False)
    is_correct = db.Column(db.Boolean, nullable=True)
    score = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'submission_id': self.submission_id,
            'question_id': self.question_id,
            'answer_text': self.answer_text,
            'is_correct': self.is_correct,
            'score': self.score,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Feedback(db.Model, TimestampMixin):
    __tablename__ = "feedback"

    id = db.Column(db.Integer, primary_key=True)
    submission_id = db.Column(db.Integer, db.ForeignKey('submissions.id'), nullable=False)
    question_id = db.Column(db.Integer, db.ForeignKey('questions.id'), nullable=True)
    recruiter_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    text = db.Column(db.Text, nullable=False)
    score = db.Column(db.Float, nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'submission_id': self.submission_id,
            'question_id': self.question_id,
            'recruiter_id': self.recruiter_id,
            'text': self.text,
            'score': self.score,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Notification(db.Model, TimestampMixin):
    __tablename__ = "notifications"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    type = db.Column(db.Enum('info', 'warning', 'error', name="notification_types"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    is_read = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'is_read': self.is_read,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
