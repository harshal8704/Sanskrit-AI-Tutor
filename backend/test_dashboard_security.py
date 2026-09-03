import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from starlette.requests import Request

import main
from modules.sqlite_repository import SQLiteRepository


class DashboardAndSecurityTests(unittest.TestCase):
    def setUp(self):
        self.temp_directory = tempfile.TemporaryDirectory()
        self.repository = SQLiteRepository(str(Path(self.temp_directory.name) / "progress.sqlite3"))
        self.repository.initialize()
        self.users = {
            "alice": {"password": "hashed_alice", "role": "student", "level": "beginner", "created_at": "2026-09-02T00:00:00"},
            "bob": {"password": "hashed_bob", "role": "student", "level": "beginner", "created_at": "2026-09-02T00:00:00"},
        }
        self.repository.migrate_users(self.users)
        self.catalog = [
            {"id": "lesson_1", "title": "Lesson 1", "description": "Intro", "level": "beginner", "module": "module_1_foundations", "file": "day1.json", "prerequisites": [], "estimated_time": 15},
            {"id": "lesson_2", "title": "Lesson 2", "description": "Next", "level": "beginner", "module": "module_1_foundations", "file": "day2.json", "prerequisites": ["lesson_1"], "estimated_time": 20},
        ]

    def tearDown(self):
        self.temp_directory.cleanup()

    def token(self, username):
        return main.auth.create_access_token(username)

    def request_headers(self, username):
        return {"Authorization": f"Bearer {self.token(username)}"}

    @staticmethod
    def request(headers=None):
        raw_headers = [
            (key.lower().encode("latin-1"), value.encode("latin-1"))
            for key, value in (headers or {}).items()
        ]
        return Request({"type": "http", "method": "GET", "path": "/", "headers": raw_headers})

    def test_dashboard_aggregates_user_data(self):
        alice_id = self.repository.get_user_id("alice")
        self.repository.complete_lesson(alice_id, "lesson_1")
        self.repository.record_quiz_attempt(alice_id, "lesson_1", "quiz", 80, 4, 5)
        self.repository.record_grammar_activity(alice_id, "रामः गच्छति।", 90, "basic", 2, 0, {"score": 90})
        self.repository.record_learning_day(alice_id, "2026-09-03", source="lesson")
        with patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users), patch.object(main.db, "load_all_lessons", return_value=self.catalog):
            body = main.get_dashboard("alice", self.request(self.request_headers("alice")))
        self.assertEqual(body["statistics"]["lessons_completed"], 1)
        self.assertEqual(body["statistics"]["quiz_attempts"], 1)
        self.assertEqual(body["statistics"]["quiz_average_score"], 80.0)
        self.assertEqual(body["statistics"]["grammar_activity_count"], 1)
        self.assertEqual(body["statistics"]["active_learning_days"], 1)
        self.assertEqual(body["recommendation"]["lesson_id"], "lesson_2")
        self.assertEqual(len(body["recent_activity"]), 3)

    def test_new_user_dashboard_has_zero_activity_and_first_recommendation(self):
        with patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users), patch.object(main.db, "load_all_lessons", return_value=self.catalog):
            body = main.get_dashboard("bob", self.request(self.request_headers("bob")))
        self.assertEqual(body["statistics"]["lessons_completed"], 0)
        self.assertEqual(body["statistics"]["quiz_attempts"], 0)
        self.assertEqual(body["statistics"]["grammar_activity_count"], 0)
        self.assertEqual(body["recommendation"]["lesson_id"], "lesson_1")
        self.assertEqual(body["recent_activity"], [])

    def test_dashboard_requires_matching_authenticated_identity(self):
        with patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users), patch.object(main.db, "load_all_lessons", return_value=self.catalog):
            with self.assertRaises(Exception) as missing:
                main.get_dashboard("alice", self.request())
            self.assertEqual(missing.exception.status_code, 401)
            with self.assertRaises(Exception) as mismatch:
                main.get_dashboard("bob", self.request(self.request_headers("alice")))
            self.assertEqual(mismatch.exception.status_code, 403)

    def test_user_a_cannot_submit_or_read_user_b_data(self):
        with patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users), patch.object(main.db, "load_all_lessons", return_value=self.catalog):
            request = self.request(self.request_headers("alice"))
            calls = [
                lambda: main.mark_lesson_complete("bob", {"lesson_id": "lesson_1"}, request),
                lambda: main.submit_quiz("bob", main.QuizSubmissionRequest(lesson_id="lesson_1", answers={}), request),
                lambda: main.check_grammar(main.GrammarRequest(username="bob", text="रामः"), request),
                lambda: main.get_streak_summary("bob", request),
                lambda: main.get_recommendation("bob", request),
                lambda: main.get_progress("bob", request),
                lambda: main.get_activities("bob", request),
            ]
            for call in calls:
                with self.assertRaises(Exception) as context:
                    call()
                self.assertEqual(context.exception.status_code, 403)

    def test_login_response_contains_no_password_hash(self):
        authenticator = main.auth
        with patch.object(authenticator, "login", return_value={"username": "alice", "role": "student", "level": "beginner"}):
            response = main.login(main.LoginRequest(username="alice", password="secret"))
        self.assertEqual(response["username"], "alice")
        self.assertIn("access_token", response)
        self.assertNotIn("password", response)
        self.assertNotIn("password_hash", response)


if __name__ == "__main__":
    unittest.main()
