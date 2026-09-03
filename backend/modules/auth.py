"""
Authentication module for SanskritaAI
Simple user authentication for prototype
"""

import json
import os
import base64
import hashlib
import hmac
import secrets
import time
from datetime import datetime

# Bcrypt is required for all newly stored passwords.
try:
    import bcrypt
    BCRYPT_AVAILABLE = True
except ImportError:
    BCRYPT_AVAILABLE = False

_DEVELOPMENT_TOKEN_SECRET = secrets.token_bytes(32)
_REVOKED_TOKEN_DIGESTS = set()

class Authenticator:
    def __init__(self, users_file='data/users.json'):
        self.users_file = users_file
        self.users = self.load_users()
    
    def load_users(self):
        """Load users from JSON file with better error handling"""
        try:
            # Check if file exists
            if os.path.exists(self.users_file):
                # Check if file is empty
                if os.path.getsize(self.users_file) == 0:
                    print(f"⚠️ Users file {self.users_file} is empty. Creating default users.")
                    return self.create_default_users()
                
                # Try to load JSON
                with open(self.users_file, 'r', encoding='utf-8') as f:
                    content = f.read().strip()
                    if content:
                        users = json.loads(content)
                        print(f"✅ Loaded {len(users)} users from file")
                        return users
                    else:
                        print(f"⚠️ Users file {self.users_file} is empty. Creating default users.")
                        return self.create_default_users()
            else:
                print(f"⚠️ Users file {self.users_file} not found. Creating default users.")
                return self.create_default_users()
                
        except json.JSONDecodeError as e:
            print(f"❌ Error parsing users JSON: {e}")
            print("Creating default users...")
            return self.create_default_users()
        except Exception as e:
            print(f"❌ Unexpected error loading users: {e}")
            return self.create_default_users()
    
    def create_default_users(self):
        """Start with no users; public signup can create student accounts."""
        return {}
    
    def save_users(self, users=None):
        """Save users to JSON file"""
        if users is None:
            users = self.users
        
        try:
            os.makedirs(os.path.dirname(self.users_file), exist_ok=True)
            with open(self.users_file, 'w', encoding='utf-8') as f:
                json.dump(users, f, indent=2, ensure_ascii=False)
            print(f"✅ Users saved to {self.users_file}")
        except Exception as e:
            print(f"❌ Error saving users: {e}")
    
    def hash_password(self, password):
        """Hash a password for storing"""
        if not BCRYPT_AVAILABLE:
            raise RuntimeError("bcrypt is required for password hashing")
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def verify_password(self, stored_password, provided_password):
        """Verify a stored password against one provided by user"""
        if not BCRYPT_AVAILABLE or not isinstance(stored_password, str):
            return False
        try:
            return bcrypt.checkpw(
                provided_password.encode('utf-8'),
                stored_password.encode('utf-8')
            )
        except (ValueError, TypeError):
            return False
    
    def login(self, username, password):
        """Authenticate a user"""
        if username in self.users:
            stored_password = self.users[username]['password']
            password_valid = self.verify_password(stored_password, password)
            legacy_hash = isinstance(stored_password, str) and stored_password.startswith("hashed_")
            if not password_valid and legacy_hash:
                password_valid = hmac.compare_digest(
                    stored_password, f"hashed_{password}"
                )
                if password_valid:
                    self.users[username]['password'] = self.hash_password(password)
                    self.save_users()
            if password_valid:
                return {
                    'username': username,
                    'role': self.users[username].get('role', 'student'),
                    'level': self.users[username].get('level', 'beginner'),
                    'completed': self.users[username].get('completed', 0)
                }
        return None

    def create_access_token(self, username):
        secret = self._token_secret()
        payload = f"{username}:{int(time.time()) + 86400}".encode("utf-8")
        encoded = base64.urlsafe_b64encode(payload).decode("ascii").rstrip("=")
        signature = hmac.new(
            secret, encoded.encode("ascii"), hashlib.sha256
        ).hexdigest()
        return f"{encoded}.{signature}"

    def verify_access_token(self, token):
        if not isinstance(token, str) or "." not in token:
            return None
        if self.token_is_revoked(token):
            return None
        encoded, signature = token.split(".", 1)
        expected = hmac.new(
            self._token_secret(), encoded.encode("ascii"), hashlib.sha256
        ).hexdigest()
        if not hmac.compare_digest(signature, expected):
            return None
        try:
            padding = "=" * (-len(encoded) % 4)
            username, expiry = base64.urlsafe_b64decode(
                f"{encoded}{padding}"
            ).decode("utf-8").rsplit(":", 1)
            if int(expiry) < int(time.time()) or username not in self.users:
                return None
        except (ValueError, UnicodeError, base64.binascii.Error):
            return None
        return username

    def revoke_access_token(self, token):
        if isinstance(token, str) and token:
            _REVOKED_TOKEN_DIGESTS.add(hashlib.sha256(token.encode("utf-8")).digest())

    @staticmethod
    def token_is_revoked(token):
        return hashlib.sha256(token.encode("utf-8")).digest() in _REVOKED_TOKEN_DIGESTS

    @staticmethod
    def _token_secret():
        configured_secret = os.getenv("AUTH_TOKEN_SECRET")
        if configured_secret:
            return configured_secret.encode("utf-8")
        if os.getenv("APP_ENV", "development").lower() == "production":
            raise RuntimeError("AUTH_TOKEN_SECRET must be configured in production")
        return _DEVELOPMENT_TOKEN_SECRET
    
    def signup(self, username, password, role="student"):
        """Create a new user account"""
        if username in self.users:
            return False
        
        self.users[username] = {
            "password": self.hash_password(password),
            "role": "student",
            "created_at": datetime.now().isoformat(),
            "level": "beginner",
            "completed": 0
        }
        
        self.save_users()
        return True