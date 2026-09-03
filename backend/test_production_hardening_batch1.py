import os
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

import main
from modules.auth import Authenticator


class ProductionHardeningBatch1Tests(unittest.TestCase):
    def test_diagnostic_endpoint_returns_status_only(self):
        response = main.test_api()
        self.assertIn("configured", response)
        self.assertIn("status", response)
        self.assertNotIn("key_preview", response)
        self.assertNotIn("api_key", response)
        self.assertNotIn("token", response)
        self.assertNotIn("secret", response)

    def test_signup_always_creates_student(self):
        with tempfile.TemporaryDirectory() as directory:
            authenticator = Authenticator(str(Path(directory) / "users.json"))
            with patch.object(main, "auth", authenticator), patch.object(
                main.learning_db, "migrate_users"
            ):
                response = main.signup(
                    main.SignupRequest(
                        username="new_user", password="correct horse", role="admin"
                    )
                )
            self.assertEqual(response["message"], "Account created successfully")
            self.assertEqual(authenticator.users["new_user"]["role"], "student")

    def test_password_hashing_requires_bcrypt_and_never_uses_plaintext_format(self):
        authenticator = Authenticator.__new__(Authenticator)
        with patch("modules.auth.BCRYPT_AVAILABLE", False):
            with self.assertRaises(RuntimeError):
                authenticator.hash_password("password")

        with tempfile.TemporaryDirectory() as directory:
            authenticator = Authenticator(str(Path(directory) / "users.json"))
            hashed = authenticator.hash_password("password")
            self.assertTrue(hashed.startswith("$2"))
            self.assertNotIn("password", hashed)

    def test_legacy_hash_is_migrated_after_successful_login(self):
        with tempfile.TemporaryDirectory() as directory:
            authenticator = Authenticator(str(Path(directory) / "users.json"))
            authenticator.users = {
                "legacy": {
                    "password": "hashed_old-password",
                    "role": "student",
                    "level": "beginner",
                    "created_at": "2026-09-03T00:00:00",
                }
            }
            result = authenticator.login("legacy", "old-password")
            self.assertEqual(result["username"], "legacy")
            self.assertTrue(authenticator.users["legacy"]["password"].startswith("$2"))
            self.assertTrue(authenticator.verify_password(authenticator.users["legacy"]["password"], "old-password"))

    def test_production_token_secret_missing_fails_closed(self):
        with patch.dict(os.environ, {"APP_ENV": "production"}, clear=False):
            os.environ.pop("AUTH_TOKEN_SECRET", None)
            with self.assertRaises(RuntimeError):
                main.auth.create_access_token("alice")

    def test_logout_revokes_token(self):
        token = main.auth.create_access_token("demo")
        request = __import__("starlette.requests", fromlist=["Request"]).Request(
            {
                "type": "http",
                "method": "POST",
                "path": "/auth/logout",
                "headers": [(b"authorization", f"Bearer {token}".encode())],
            }
        )
        self.assertEqual(main.logout(request), {"success": True})
        self.assertIsNone(main.auth.verify_access_token(token))

    def test_malformed_and_expired_tokens_fail_cleanly(self):
        self.assertIsNone(main.auth.verify_access_token("not-a-token"))
        with patch.dict(os.environ, {"AUTH_TOKEN_SECRET": "test-secret"}):
            token = main.auth.create_access_token("demo")
            encoded, signature = token.split(".", 1)
            self.assertIsNone(main.auth.verify_access_token(f"{encoded}.invalid"))
            self.assertIsNotNone(signature)
        with patch("modules.auth.time.time", side_effect=[1000, 1000 + 86401]):
            expired_token = main.auth.create_access_token("demo")
            self.assertIsNone(main.auth.verify_access_token(expired_token))

    def test_request_models_reject_oversized_or_invalid_values(self):
        with self.assertRaises(ValueError):
            main.GrammarRequest(username="alice", text="x" * 5001)
        with self.assertRaises(ValueError):
            main.TranslateRequest(text="hello", direction="invalid")
        with self.assertRaises(ValueError):
            main.QuizSubmissionRequest(lesson_id="lesson", answers={"q": 101})

    def test_cors_uses_explicit_origin_without_credentials(self):
        middleware = next(
            middleware
            for middleware in main.app.user_middleware
            if middleware.cls.__name__ == "CORSMiddleware"
        )
        self.assertNotEqual(middleware.options["allow_origins"], ["*"])
        self.assertFalse(middleware.options["allow_credentials"])

    def test_existing_authentication_still_works(self):
        with tempfile.TemporaryDirectory() as directory:
            authenticator = Authenticator(str(Path(directory) / "users.json"))
            authenticator.users = {
                "existing": {
                    "password": authenticator.hash_password("existing-password"),
                    "role": "student",
                    "level": "beginner",
                    "created_at": "2026-09-03T00:00:00",
                }
            }
            with patch.object(main, "auth", authenticator):
                result = main.login(
                    main.LoginRequest(username="existing", password="existing-password")
                )
            self.assertEqual(result["username"], "existing")
            self.assertIn("access_token", result)
            self.assertNotIn("password", result)

    def test_frontend_logout_removes_token(self):
        sidebar = Path(__file__).parents[1] / "frontend" / "src" / "components" / "Sidebar.tsx"
        source = sidebar.read_text(encoding="utf-8")
        self.assertIn("localStorage.removeItem('access_token')", source)


if __name__ == "__main__":
    unittest.main()
