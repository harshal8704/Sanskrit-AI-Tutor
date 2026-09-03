import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import main
from modules.sqlite_repository import SQLiteRepository


class RecommendationTests(unittest.TestCase):
    def setUp(self):
        self.temp_directory = tempfile.TemporaryDirectory()
        self.repository = SQLiteRepository(
            str(Path(self.temp_directory.name) / "progress.sqlite3")
        )
        self.repository.initialize()
        self.users = {
            "alice": {
                "password": "hashed_alice",
                "role": "student",
                "level": "beginner",
                "created_at": "2026-09-02T00:00:00",
            },
            "bob": {
                "password": "hashed_bob",
                "role": "student",
                "level": "beginner",
                "created_at": "2026-09-02T00:00:00",
            },
        }
        self.repository.migrate_users(self.users)
        self.catalog = [
            {"id": "lesson_1", "title": "Lesson 1", "description": "Intro", "level": "beginner", "prerequisites": []},
            {"id": "lesson_2", "title": "Lesson 2", "description": "Basics", "level": "beginner", "prerequisites": ["lesson_1"]},
            {"id": "lesson_3", "title": "Lesson 3", "description": "Practice", "level": "beginner", "prerequisites": []},
            {"id": "lesson_4", "title": "Lesson 4", "description": "Advance", "level": "beginner", "prerequisites": ["lesson_3"]},
        ]

    def tearDown(self):
        self.temp_directory.cleanup()

    def test_new_user_gets_first_lesson(self):
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["lesson_id"], "lesson_1")
        self.assertEqual(response["title"], "Lesson 1")

    def test_completed_lessons_are_excluded(self):
        user_id = self.repository.get_user_id("alice")
        self.repository.complete_lesson(user_id, "lesson_1")
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["lesson_id"], "lesson_2")

    def test_sequential_progress_returns_next_lesson(self):
        user_id = self.repository.get_user_id("alice")
        self.repository.complete_lesson(user_id, "lesson_1")
        self.repository.complete_lesson(user_id, "lesson_3")
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["lesson_id"], "lesson_2")

    def test_gap_returns_earliest_appropriate_incomplete_lesson(self):
        user_id = self.repository.get_user_id("alice")
        self.repository.complete_lesson(user_id, "lesson_1")
        self.repository.complete_lesson(user_id, "lesson_2")
        self.repository.complete_lesson(user_id, "lesson_4")
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["lesson_id"], "lesson_3")

    def test_out_of_order_completions_still_work(self):
        user_id = self.repository.get_user_id("alice")
        self.repository.complete_lesson(user_id, "lesson_3")
        self.repository.complete_lesson(user_id, "lesson_1")
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["lesson_id"], "lesson_2")

    def test_all_lessons_completed_returns_completion_state(self):
        user_id = self.repository.get_user_id("alice")
        for lesson in ["lesson_1", "lesson_2", "lesson_3", "lesson_4"]:
            self.repository.complete_lesson(user_id, lesson)
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertEqual(response["status"], "all_lessons_completed")

    def test_invalid_username_is_rejected(self):
        with patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            with self.assertRaises(Exception):
                main.get_recommendation("missing")

    def test_user_progress_is_isolated(self):
        alice_id = self.repository.get_user_id("alice")
        bob_id = self.repository.get_user_id("bob")
        self.repository.complete_lesson(alice_id, "lesson_1")
        self.repository.complete_lesson(bob_id, "lesson_2")
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            alice_response = main.get_recommendation("alice")
            bob_response = main.get_recommendation("bob")
        self.assertEqual(alice_response["lesson_id"], "lesson_2")
        self.assertEqual(bob_response["lesson_id"], "lesson_1")

    def test_recommendation_uses_real_curriculum_metadata(self):
        with patch.object(main.db, "load_all_lessons", return_value=self.catalog), patch.object(main, "learning_db", self.repository), patch.object(main.auth, "users", self.users):
            response = main.get_recommendation("alice")
        self.assertIn("lesson_id", response)
        self.assertIn("title", response)
        self.assertIn("description", response)


if __name__ == "__main__":
    unittest.main()
