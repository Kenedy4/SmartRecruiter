from datetime import datetime, timedelta
from flask import json
from app import db, app
from models import User, Assessment, Question, Invitation, Submission, Answer, Feedback, Notification
from sqlalchemy.exc import IntegrityError
from flask_bcrypt import Bcrypt

# Initialize bcrypt
bcrypt = Bcrypt()

def seed_data():
    with app.app_context():
        # Dropping and creating all tables
        db.drop_all()
        print("Dropping the existing tables")
        db.create_all()
        print("Creating all tables Afresh")

        # sample users with hashed passwords
        users = [
            User(username="recruiter1", first_name="Sarah", last_name="Mpengu", email="saram@gmail.com",
                 role="recruiter", gender="female", password_hash=bcrypt.generate_password_hash("password").decode('utf-8'), company_name="Tech Corp"),
            User(username="interviewee1", first_name="Rey", last_name="Jamal", email="ryj@gmail.com",
                 role="interviewee", gender="male", password_hash=bcrypt.generate_password_hash("password").decode('utf-8'), consent=True),
            User(username="recruiter2", first_name="Babu", last_name="Msafi", email="babu@gmail.com",
                 role="recruiter", gender="male", password_hash=bcrypt.generate_password_hash("password").decode('utf-8'), company_name="Biz Solutions"),
            User(username="interviewee2", first_name="Daisy", last_name="Nyaga", email="daisy@gmail.com",
                 role="interviewee", gender="female", password_hash=bcrypt.generate_password_hash("password").decode('utf-8'), consent=False)
        ]

        db.session.add_all(users)
        db.session.commit()
        print("User created Successfully")

        # Assessments
        assessments = [
            Assessment(title="Tech Screening", description="Basic technical screening assessment",
                       recruiter_id=users[0].id, time_limit=60, is_published=True),
            Assessment(title="Sales Aptitude Test", description="Sales skills and aptitude test",
                       recruiter_id=users[2].id, time_limit=45, is_published=False)
        ]

        db.session.add_all(assessments)
        db.session.commit()
        print("Assessment created Successfully")

        # Questions
        questions = [
            Question(assessment_id=assessments[0].id, type="multiple_choice",
                     text="What is the capital of France?", choices=json.dumps(["Paris", "London", "Rome"]), correct_answer="Paris"),
            Question(assessment_id=assessments[0].id, type="coding",
                     text="Write a function to reverse a string.", correct_answer="function reverseString(str) { return str.split('').reverse().join(''); }"),
            Question(assessment_id=assessments[1].id, type="subjective",
                     text="Describe a sales strategy you have used successfully.")
        ]

        db.session.add_all(questions)
        db.session.commit()
        print("Question created Successfully")

        # Invitations
        invitations = [
            Invitation(assessment_id=assessments[0].id, interviewee_id=users[1].id, status="accepted", expiry_date=datetime.utcnow() + timedelta(days=7)),
            Invitation(assessment_id=assessments[1].id, interviewee_id=users[3].id, status="pending", expiry_date=datetime.utcnow() + timedelta(days=5))
        ]

        db.session.add_all(invitations)
        db.session.commit()
        print("Invitation created Successfully")

        # Submissions
        submissions = [
            Submission(assessment_id=assessments[0].id, interviewee_id=users[1].id, status="submitted", score=85.0, submitted_at=datetime.utcnow()),
            Submission(assessment_id=assessments[1].id, interviewee_id=users[3].id, status="in_progress")
        ]

        db.session.add_all(submissions)
        db.session.commit()
        print("Submission created Successfully")

        # Answers
        answers = [
            Answer(submission_id=submissions[0].id, question_id=questions[0].id, answer_text="Paris", is_correct=True, score=10.0),
            Answer(submission_id=submissions[0].id, question_id=questions[1].id, answer_text="function reverseString(str) { return str.split('').reverse().join(''); }", is_correct=True, score=10.0)
        ]

        db.session.add_all(answers)
        db.session.commit()
        print("Answer created Successfully")

        # Feedback
        feedbacks = [
            Feedback(submission_id=submissions[0].id, question_id=questions[0].id, recruiter_id=users[0].id, text="Good answer!", score=10.0),
            Feedback(submission_id=submissions[0].id, question_id=questions[1].id, recruiter_id=users[0].id, text="Correct solution.", score=10.0)
        ]

        db.session.add_all(feedbacks)
        db.session.commit()
        print("Feedback created Successfully")

        # Create notifications
        notifications = [
            Notification(user_id=users[1].id, type="info", message="Your assessment has been graded.", is_read=True),
            Notification(user_id=users[3].id, type="warning", message="Your assessment invitation is about to expire.", is_read=False)
        ]

        db.session.add_all(notifications)
        db.session.commit()
        print("Notification created Successfully")

        print("Database has been seeded successfully.")

if __name__ == "__main__":
    try:
        seed_data()
    except IntegrityError:
        db.session.rollback()
        print("Error occurred during seeding, rolling back changes.")
