import os
import secrets

SECRET_KEY = os.getenv('SECRET_KEY', secrets.token_hex(20))
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', secrets.token_hex(20))

print(secrets.token_hex(20))