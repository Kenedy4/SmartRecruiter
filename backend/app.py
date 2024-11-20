import json
import os
from flask import Flask, request, jsonify, make_response  # type: ignore
from sqlalchemy import extract, func  # type: ignore
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError  # type: ignore
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt  # type: ignore
from flask_restful import Resource, Api, reqparse  # type: ignore
from config import Config
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore
from werkzeug.exceptions import HTTPException  # type: ignore
from flask_bcrypt import Bcrypt  # type: ignore
from flask_mail import Mail  # type: ignore
from flask_cors import CORS  # type: ignore
import jwt  # type: ignore
import random
import string
from flask_migrate import Migrate  # type: ignore
from models import Answer, db, User, PasswordReset, Feedback, Submission, Assessment, Invitation, Question

# Flask app setup using Config class
app = Flask(__name__)
app.config.from_object(Config)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
mail = Mail(app)
CORS(app, resources={r"/*": {"origins": "*"}})
migrate = Migrate(app, db)
db.init_app(app)
api = Api(app)

# Secret key for JWT
app.config["JWT_SECRET_KEY"] = "9c87d026e48582dd69dff29dc9ebfbe90a758cc2"

# General Error Handlers
@app.errorhandler(SQLAlchemyError)
def handle_db_exception(e):
    """Handles SQLAlchemy-specific errors."""
    return jsonify({
        "message": "Database Error",
        "error": str(e)
    }), 500

@app.errorhandler(HTTPException)
def handle_http_exception(e):
    """Handles HTTP exceptions."""
    return jsonify({
        "message": e.description or "An HTTP error occurred",
        "error": str(e)
    }), e.code

@app.errorhandler(Exception)
def handle_general_exception(e):
    """Handles all other exceptions."""
    return jsonify({
        "message": "An unexpected error occurred",
        "error": str(e)
    }), 500

# Resource for the Welcome Endpoint
class Welcome(Resource):
    def get(self):
        return {"message": "Welcome to Smart Recruiter, where we actualize your dreams and skills"}, 200

api.add_resource(Welcome, '/')

# Signup Resource
class Signup(Resource):
    def post(self):
        try:
            data = request.get_json()

            # Extract and validate fields
            required_fields = ['first_name', 'last_name', 'username', 'email', 'password', 'role', 'gender']
            missing_fields = [field for field in required_fields if not data.get(field)]
            if missing_fields:
                return make_response(jsonify({
                    "message": f"Missing required fields: {', '.join(missing_fields)}"
                }), 400)

            # Role-specific validation
            role = data['role'].lower()
            if role == 'recruiter' and not data.get('company_name'):
                return make_response(jsonify({"message": "Company name is required for Recruiter role"}), 400)
            if role == 'interviewee' and data.get('consent') is None:
                return make_response(jsonify({"message": "Consent is required for Interviewee role"}), 400)

            # Check for duplicate user
            if User.query.filter((User.username == data['username']) | (User.email == data['email'])).first():
                return make_response(jsonify({"message": "Username or email already exists"}), 409)

            # Create and save the user
            hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
            new_user = User(
                first_name=data['first_name'],
                last_name=data['last_name'],
                username=data['username'],
                email=data['email'],
                role=role,
                gender=data['gender'],
                password_hash=hashed_password,
                company_name=data.get('company_name'),
                consent=data.get('consent'),
            )
            db.session.add(new_user)
            db.session.commit()
            return make_response(jsonify({"message": "User registered successfully"}), 201)

        except SQLAlchemyError as e:
            db.session.rollback()
            return handle_db_exception(e)
        except KeyError as e:
            return make_response(jsonify({
                "message": "Missing required field",
                "error": f"Missing key: {str(e)}"
            }), 400)
        except Exception as e:
            return handle_general_exception(e)

api.add_resource(Signup, '/signup')

# Blocklist for Token Revocation
blocklist = set()

@jwt.token_in_blocklist_loader
def check_if_token_in_blocklist(jwt_header, jwt_payload):
    jti = jwt_payload.get("jti")
    return jti in blocklist

# Login Resource
class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')

            if not all([username, password]):
                return make_response(jsonify({"message": "Username and password are required"}), 400)

            user = User.query.filter_by(username=username).first()
            if user and check_password_hash(user.password_hash, password):
                access_token = create_access_token(identity=user.id, expires_delta=timedelta(hours=2))
                return make_response(jsonify({
                    "token": access_token,
                    "role": user.role,
                    "message": "Login successful"
                }), 200)

            return make_response(jsonify({"message": "Invalid credentials"}), 401)

        except SQLAlchemyError as e:
            return handle_db_exception(e)
        except Exception as e:
            return handle_general_exception(e)

api.add_resource(Login, '/login')

# Logout Resource
class Logout(Resource):
    @jwt_required()
    def post(self):
        try:
            jti = get_jwt().get("jti")
            if jti:
                blocklist.add(jti)
                return make_response(jsonify({"message": "Logged out successfully"}), 200)
            else:
                return make_response(jsonify({"message": "JWT ID (jti) not found in token"}), 400)
        except Exception as e:
            return handle_general_exception(e)

api.add_resource(Logout, '/logout')

# Forgot Password Resource
class ForgotPassword(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('email', required=True, help="Email is required.")
        data = parser.parse_args()

        try:
            user = User.query.filter_by(email=data['email']).first()
            if user:
                token = ''.join(random.choices(string.ascii_letters + string.digits, k=20))
                expiration_time = datetime.utcnow() + timedelta(hours=1)
                reset_token = PasswordReset(user_id=user.id, token=token, expiration=expiration_time)
                db.session.add(reset_token)
                db.session.commit()
                return make_response(jsonify({'message': 'Password reset token sent', 'token': token}), 200)

            return make_response(jsonify({"message": "User not found"}), 404)

        except SQLAlchemyError as e:
            db.session.rollback()
            return handle_db_exception(e)
        except Exception as e:
            return handle_general_exception(e)

api.add_resource(ForgotPassword, '/forgot-password')

# Password Reset Resource
class PasswordReset(Resource):
    def post(self, token):
        parser = reqparse.RequestParser()
        parser.add_argument('new_pass', required=True, help="New password is required.")
        data = parser.parse_args()

        try:
            reset_token = PasswordReset.query.filter_by(token=token).first()
            if reset_token and reset_token.expiration > datetime.utcnow():
                user = User.query.filter_by(id=reset_token.user_id).first()
                user.password_hash = generate_password_hash(data['new_pass'], method='pbkdf2:sha256')
                db.session.delete(reset_token)
                db.session.commit()
                return make_response(jsonify({'message': 'Password reset successfully'}), 200)

            return make_response(jsonify({'message': 'Token is invalid or has expired'}), 400)

        except SQLAlchemyError as e:
            db.session.rollback()
            return handle_db_exception(e)
        except Exception as e:
            return handle_general_exception(e)

api.add_resource(PasswordReset, '/reset-password/<string:token>')

## Data Parsers for Validation
assessment_parser = reqparse.RequestParser()
assessment_parser.add_argument('title', required=True, help="Title is required")
assessment_parser.add_argument('recruiter_id', required=True, type=int, help="Recruiter ID is required")
assessment_parser.add_argument('time_limit', required=True, type=int, help="Time limit is required")
assessment_parser.add_argument('description', required=False)
assessment_parser.add_argument('is_published', required=False, type=bool)

# Assessment Routes with JWT and Pagination
class AssessmentList(Resource):
    @jwt_required()
    def get(self):
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            assessments = Assessment.query.paginate(page=page, per_page=per_page)
            # Return paginated assessments with HTTP 200 (OK)
            return make_response(jsonify([assessment.to_dict() for assessment in assessments.items]), 200)
        except Exception as e:
            # Return Internal Server Error 500
            return handle_general_exception(e)

    @jwt_required()
    def post(self):
        try:
            args = request.get_json()
            new_assessment = Assessment(
                title=args['title'],
                description=args.get('description', ""),
                recruiter_id=args['recruiter_id'],
                time_limit=args['time_limit'],
                is_published=args.get('is_published', False)
            )
            db.session.add(new_assessment)
            db.session.commit()
            # Successfully created resource with HTTP 201 (Created)
            return make_response(jsonify(new_assessment.to_dict()), 201)
        except SQLAlchemyError as e:
            db.session.rollback()
            # Return 500 (Internal Server Error)
            return handle_db_exception(e)

class AssessmentDetail(Resource):
    @jwt_required()
    def get(self, id):
        try:
            # Return 404 (Not Found) if no assessment exists
            assessment = Assessment.query.get_or_404(id)
            # Return assessment with HTTP 200 (OK)
            return make_response(jsonify(assessment.to_dict()), 200)
        except Exception as e:
            # Return 500 (Internal Server Error)
            return handle_general_exception(e)
    @jwt_required()
    def put(self, id):
        try:
            args = request.get_json()
            assessment = Assessment.query.get_or_404(id)
            assessment.title = args.get('title', assessment.title)
            assessment.description = args.get('description', assessment.description)
            assessment.is_published = args.get('is_published', assessment.is_published)
            db.session.commit()
            # Return updated assessment with HTTP 200 (OK)
            return jsonify(assessment.to_dict()), 200
        except SQLAlchemyError as e:
            db.session.rollback()
            # Return 500 (Internal Server Error)
            return handle_db_exception(e)
    @jwt_required()
    def delete(self, id):
        try:
            assessment = Assessment.query.get_or_404(id)
            db.session.delete(assessment)
            db.session.commit()
            # Successfully deleted with HTTP 204 (No Content)
            return make_response(jsonify({"message": "Assessment deleted"}), 204)
        except SQLAlchemyError as e:
            db.session.rollback()
            # Return 500 (Internal Server Error)
            return handle_db_exception(e)
api.add_resource(AssessmentList, '/assessments')
api.add_resource(AssessmentDetail, '/assessments/<int:id>')

# Data Parser for Single or Bulk Invitations
invitation_parser = reqparse.RequestParser()
invitation_parser.add_argument('assessment_id', required=True, type=int, help="Assessment ID is required")
invitation_parser.add_argument('interviewee_id', type=int, help="Single Interviewee ID")
invitation_parser.add_argument('interviewee_ids', type=list, location='json', help="List of Interviewee IDs")
invitation_parser.add_argument('status', required=False, default="pending", choices=['pending', 'accepted', 'completed', 'expired'])
invitation_parser.add_argument('expiry_date', required=False)

# Invitation Routes with Support for Single or Bulk Invitations
class InvitationList(Resource):
    @jwt_required()
    def get(self):
        """Get invitations for a recruiter with pagination."""
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        invitations = Invitation.query.paginate(page=page, per_page=per_page)
        return make_response(jsonify({
            "message": "Invitations retrieved successfully.",
            "data": [invitation.to_dict() for invitation in invitations.items]
        }), 200)
    @jwt_required()
    def post(self):
        """Create single or bulk invitations."""
        args = invitation_parser.parse_args()
        assessment_id = args['assessment_id']
        interviewee_id = args.get('interviewee_id')
        interviewee_ids = args.get('interviewee_ids')
        status = args.get('status', 'pending')
        expiry_date = args.get('expiry_date')
        invitations = []
        if interviewee_id:
            new_invitation = Invitation(
                assessment_id=assessment_id,
                interviewee_id=interviewee_id,
                status=status,
                expiry_date=expiry_date
            )
            db.session.add(new_invitation)
            invitations.append(new_invitation)
        elif interviewee_ids:
            for id in interviewee_ids:
                new_invitation = Invitation(
                    assessment_id=assessment_id,
                    interviewee_id=id,
                    status=status,
                    expiry_date=expiry_date
                )
                db.session.add(new_invitation)
                invitations.append(new_invitation)
        db.session.commit()
        return make_response(jsonify({
            "message": "Invitations created successfully.",
            "data": [invitation.to_dict() for invitation in invitations]
        }), 201)
api.add_resource(InvitationList, '/invitations')

# Data Parsers for Validation for question 
question_parser = reqparse.RequestParser()
question_parser.add_argument('type', required=True, help="Type is required")
question_parser.add_argument('text', required=True, help="Text is required")
question_parser.add_argument('choices', required=False, type=dict)
question_parser.add_argument('correct_answer', required=False)

# Question Routes with JWT
class QuestionList(Resource):
    @jwt_required()
    def get(self, assessment_id):
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        questions = Question.query.filter_by(assessment_id=assessment_id).paginate(page=page, per_page=per_page)
        return make_response(jsonify([question.to_dict() for question in questions.items]), 200)
    @jwt_required()
    def post(self, assessment_id):
        args = question_parser.parse_args()
        new_question = Question(
            assessment_id=assessment_id,
            type=args['type'],
            text=args['text'],
            choices=json.dumps(args.get('choices')),
            correct_answer=args.get('correct_answer')
        )
        db.session.add(new_question)
        db.session.commit()
        return make_response(jsonify(new_question.to_dict()), 201)
api.add_resource(QuestionList, '/questions/<int:assessment_id>')

class IntervieweeList(Resource):
    @jwt_required()
    def get(self):
        """Fetch all interviewees."""
        try:
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 10, type=int)
            # Fetch interviewees from the database
            interviewees = User.query.filter_by(role='interviewee').paginate(page=page, per_page=per_page)
            return make_response(jsonify({
                "message": "Interviewees retrieved successfully.",
                "data": [interviewee.to_dict() for interviewee in interviewees.items],
                "pagination": {
                    "page": page,
                    "per_page": per_page,
                    "total": interviewees.total
                }
            }), 200)
        except Exception as e:
            return make_response(jsonify({
                "message": "Failed to fetch interviewees.",
                "error": str(e)
            }), 500)
api.add_resource(IntervieweeList, '/recruiter/interviewees')

class AssessmentInterviewees(Resource):
    @jwt_required()
    def get(self, assessment_id):
        """Fetch interviewees invited to a specific assessment."""
        try:
            # Fetch accepted invitations for the assessment
            invitations = Invitation.query.filter_by(assessment_id=assessment_id, status='accepted').all()
            # Extract interviewee details
            interviewees = [invitation.interviewee.to_dict() for invitation in invitations]
            return make_response(jsonify({
                "message": f"Interviewees for assessment {assessment_id} retrieved successfully.",
                "data": interviewees
            }), 200)
        except Exception as e:
            return make_response(jsonify({
                "message": f"Failed to fetch interviewees for assessment {assessment_id}.",
                "error": str(e)
            }), 500)
api.add_resource(AssessmentInterviewees, '/recruiter/assessments/<int:assessment_id>/interviewees')

class FeedbackResource(Resource):
    @jwt_required()
    def get(self, submission_id):
        """Fetch feedback for a specific submission."""
        user_id = get_jwt()["sub"]  # Get user ID from JWT
        submission = Submission.query.get_or_404(submission_id)
        # Ensures only the interviewee who owns the submission can view feedback
        if submission.interviewee_id != user_id:
            return make_response(jsonify({"message": "You are not authorized to view this feedback."}), 403)
        feedbacks = Feedback.query.filter_by(submission_id=submission_id).all()
        return make_response(jsonify({
            "message": "Feedback retrieved successfully.",
            "data": [feedback.to_dict() for feedback in feedbacks]
        }), 200)
    @jwt_required()
    def post(self, submission_id):
        """Create feedback for a submission."""
        data = request.get_json()
        recruiter_id = get_jwt()["sub"]  # Recruiter ID from JWT
        user = User.query.get(recruiter_id)
        # Ensure the user is a recruiter
        if user.role != "recruiter":
            return make_response(jsonify({"message": "Only recruiters can leave feedback."}), 403)
        feedback = Feedback(
            submission_id=submission_id,
            question_id=data.get("question_id"),  # Optional question-specific feedback
            recruiter_id=recruiter_id,
            text=data["text"],
            score=data.get("score")
        )
        db.session.add(feedback)
        try:
            db.session.commit()
            return make_response(jsonify({
                "message": "Feedback created successfully.",
                "data": feedback.to_dict()
            }), 201)
        except SQLAlchemyError as e:
            db.session.rollback()
            return make_response(jsonify({"message": "Database error occurred.", "error": str(e)}), 500)
api.add_resource(FeedbackResource, '/feedback/<int:submission_id>')

class IntervieweeAssessments(Resource):
    @jwt_required()
    def get(self):
        interviewee_id = get_jwt()["sub"]
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        invitations = Invitation.query.filter_by(interviewee_id=interviewee_id, status="accepted").paginate(page=page, per_page=per_page)
        assessments = [invitation.assessment.to_dict() for invitation in invitations.items]
        return make_response(jsonify({
            "message": "Assessments retrieved successfully.",
            "data": assessments
        }), 200)
api.add_resource(IntervieweeAssessments, '/interviewee/assessments')

class AcceptInvitation(Resource):
    @jwt_required()
    def put(self, invitation_id):
        """Accept an invitation."""
        invitation = Invitation.query.filter_by(id=invitation_id, status="pending").first_or_404()
        if invitation.expiry_date and invitation.expiry_date < datetime.utcnow():
            return jsonify({"message": "This invitation has expired."}), 400
        invitation.status = "accepted"
        db.session.commit()
        return make_response(jsonify({"message": "Invitation accepted successfully."}), 200)
api.add_resource(AcceptInvitation, '/interviewee/invitations/<int:invitation_id>/accept')

class TrialAssessment(Resource):
    @jwt_required()
    def get(self):
        questions = [
            {"id": 1, "type": "multiple_choice", "text": "What is 2 + 2?", "choices": {"A": "3", "B": "4", "C": "5"}, "correct_answer": "B"},
            {"id": 2, "type": "subjective", "text": "Explain the concept of recursion."}
        ]
        return make_response(jsonify({
            "message": "Trial assessment retrieved successfully.",
            "data": {
                "title": "Trial Assessment",
                "questions": questions
            }
        }), 200)
api.add_resource(TrialAssessment, '/interviewee/trial-assessment')

class SubmitAssessment(Resource):
    @jwt_required()
    def post(self, assessment_id):
        """Submit an assessment by an interviewee."""
        try:
            interviewee_id = get_jwt()["sub"]
            data = request.get_json()
            # Validate required fields
            if not data or "answers" not in data:
                return make_response(jsonify({
                    "message": "Invalid input. 'answers' field is required."
                }), 400)

            # Create a new submission
            submission = Submission(
                assessment_id=assessment_id,
                interviewee_id=interviewee_id,
                status="submitted",
                submitted_at=datetime.utcnow()
            )
            db.session.add(submission)

            # Add answers to the submission
            for answer in data.get("answers", []):
                if "question_id" not in answer or "answer_text" not in answer:
                    return make_response(jsonify({
                        "message": "Each answer must include 'question_id' and 'answer_text'."
                    }), 400)
                db.session.add(Answer(
                    submission_id=submission.id,
                    question_id=answer["question_id"],
                    answer_text=answer["answer_text"]
                ))
            # Commit the transaction
            db.session.commit()
            return make_response(jsonify({
                "message": "Assessment submitted successfully.",
                "data": submission.to_dict()
            }), 201)
        except SQLAlchemyError as e:
            db.session.rollback()
            return make_response(jsonify({
                "message": "Database error occurred.",
                "error": str(e)
            }), 500)
        except Exception as e:
            return make_response(jsonify({
                "message": "An unexpected error occurred.",
                "error": str(e)
            }), 500)
api.add_resource(SubmitAssessment, '/interviewee/assessments/<int:assessment_id>/submit')

# API for Interviewee Status
class IntervieweeStatus(Resource):
    @jwt_required()
    def get(self):
        """
        Fetch interviewee status, including average score and qualification status.
        """
        try:
            # Query all users with role = 'interviewee'
            interviewees = User.query.filter_by(role='interviewee').all()
            # Serialize interviewee data with custom formatting
            interviewee_status = [
                {
                    "id": interviewee.id,
                    "name": f"{interviewee.first_name} {interviewee.last_name}",
                    "average_score": interviewee.average_score(),
                    "status": "Qualified" if interviewee.average_score() >= 50 else "Not Qualified"
                }
                for interviewee in interviewees
            ]
            return make_response(jsonify(interviewee_status), 200)
        except Exception as e:
            return make_response(jsonify({"message": "Failed to fetch interviewee status", "error": str(e)}), 500)
api.add_resource(IntervieweeStatus, '/interviewee/status')

# API for Interviewee Composition
class IntervieweeComposition(Resource):
    @jwt_required()
    def get(self):
        """Fetch interviewee composition based on gender."""
        try:
            male_count = User.query.filter_by(role='interviewee', gender='male').count()
            female_count = User.query.filter_by(role='interviewee', gender='female').count()
            return make_response(jsonify({"male": male_count, "female": female_count}), 200)
        except Exception as e:
            return make_response(jsonify({"message": "Failed to fetch interviewee composition", "error": str(e)}), 500)
api.add_resource(IntervieweeComposition, '/interviewee/composition')

# API for Performance Statistics
class PerformanceStatistics(Resource):
    @jwt_required()
    def get(self):
        """Fetch monthly performance statistics for assessments."""
        try:
            # Query for trial and real assessments' monthly data
            monthly_stats = (
                db.session.query(
                    extract('month', Submission.submitted_at).label('month'),
                    func.sum(Submission.score).filter(Assessment.title.ilike('%trial%')).label('trial'),
                    func.sum(Submission.score).filter(Assessment.title.ilike('%real%')).label('real')
                )
                .join(Assessment, Submission.assessment_id == Assessment.id)
                .group_by('month')
                .all()
            )
            # Serialize results
            stats = [{"month": month, "trial": trial or 0, "real": real or 0} for month, trial, real in monthly_stats]
            return make_response(jsonify({"monthly": stats}), 200)
        except Exception as e:
            return make_response(jsonify({"message": "Failed to fetch performance statistics", "error": str(e)}), 500)
api.add_resource(PerformanceStatistics, '/performance/statistics')

if __name__ == '__main__':
    app.run(port=5555, host="0.0.0.0", debug=True)