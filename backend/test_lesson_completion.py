import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

import main
from modules.sqlite_repository import SQLiteRepository


class LessonCompletionTests(unittest.TestCase):
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

    def tearDown(self):
        self.temp_directory.cleanup()

    def test_completion_is_idempotent_and_stores_correct_values(self):
        alice_id = self.repository.get_user_id("alice")
        first = self.repository.complete_lesson(
            alice_id, "day1_welcome", completed_at="2026-09-02T00:00:00+00:00"
        )
        second = self.repository.complete_lesson(
            alice_id, "day1_welcome", completed_at="2026-09-03T00:00:00+00:00"
        )

        self.assertTrue(first["created"])
        self.assertFalse(second["created"])
        self.assertEqual(second["completed_count"], 1)

        with self.repository.connect() as connection:
            rows = connection.execute(
                "SELECT user_id, lesson_id FROM lesson_completions"
            ).fetchall()
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["user_id"], alice_id)
        self.assertEqual(rows[0]["lesson_id"], "day1_welcome")

    def test_different_users_can_complete_same_lesson(self):
        alice_id = self.repository.get_user_id("alice")
        bob_id = self.repository.get_user_id("bob")

        self.repository.complete_lesson(alice_id, "day1_welcome")
        self.repository.complete_lesson(bob_id, "day1_welcome")

        with self.repository.connect() as connection:
            rows = connection.execute(
                "SELECT user_id, lesson_id FROM lesson_completions "
                "ORDER BY user_id"
            ).fetchall()
        self.assertEqual([(row["user_id"], row["lesson_id"]) for row in rows], [
            (alice_id, "day1_welcome"),
            (bob_id, "day1_welcome"),
        ])

    def test_route_validates_lesson_and_preserves_response_shape(self):
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ):
            response = main.mark_lesson_complete(
                "alice", {"lesson_id": "day1_welcome"}
            )
            self.assertEqual(
                response,
                {
                    "success": True,
                    "username": "alice",
                    "lesson_id": "day1_welcome",
                    "completed": 1,
                    "message": "Lesson marked as complete",
                },
            )
            with self.assertRaises(HTTPException) as context:
                main.mark_lesson_complete(
                    "alice", {"lesson_id": "not-a-real-lesson"}
                )
            self.assertEqual(context.exception.status_code, 404)

            main.mark_lesson_complete("alice", {"lesson_id": "day1_welcome"})

        with self.repository.connect() as connection:
            count = connection.execute(
                "SELECT COUNT(*) FROM lesson_completions WHERE user_id = ?",
                (self.repository.get_user_id("alice"),),
            ).fetchone()[0]
        self.assertEqual(count, 1)


if __name__ == "__main__":
    unittest.main()