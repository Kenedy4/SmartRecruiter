import os
import secrets
from dotenv import load_dotenv # type: ignore

load_dotenv()

class Config:
    # Flask and JWT secret keys with fallback
    SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(20))
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(20))

    # Database configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('SQLALCHEMY_DATABASE_URI', "default_db_url")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_POOL_SIZE = 10
    SQLALCHEMY_MAX_OVERFLOW = 5
    SQLALCHEMY_POOL_TIMEOUT = 30

    # Application settings
    PORT = int(os.getenv('PORT', 5555))

    # Mail server settings
    MAIL_SERVER = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
    MAIL_PORT = int(os.getenv('MAIL_PORT', 587))
    MAIL_USE_TLS = os.getenv('MAIL_USE_TLS', 'True').lower() in ['true', '1', 't']
    MAIL_USERNAME = os.getenv('MAIL_USERNAME')
    MAIL_PASSWORD = os.getenv('MAIL_PASSWORD')

    # Validation for critical environment variables
    @classmethod
    def validate(cls):
        loaded_vars = {
            "SECRET_KEY": cls.SECRET_KEY,
            "SQLALCHEMY_DATABASE_URI": cls.SQLALCHEMY_DATABASE_URI,
            "MAIL_SERVER": cls.MAIL_SERVER,
            "MAIL_PORT": cls.MAIL_PORT,
            "MAIL_USE_TLS": cls.MAIL_USE_TLS,
            "MAIL_USERNAME": cls.MAIL_USERNAME,
            "MAIL_PASSWORD": cls.MAIL_PASSWORD,
        }
        print("Loaded environment variables:", loaded_vars)

        missing_vars = []
        if not cls.SECRET_KEY:
            missing_vars.append("SECRET_KEY")
        if '://' not in cls.SQLALCHEMY_DATABASE_URI:
            missing_vars.append("SQLALCHEMY_DATABASE_URI")
        if not cls.MAIL_USERNAME:
            missing_vars.append("MAIL_USERNAME")
        if not cls.MAIL_PASSWORD:
            missing_vars.append("MAIL_PASSWORD")
        if missing_vars:
            raise ValueError(f"Missing critical environment variables: {', '.join(missing_vars)}")
