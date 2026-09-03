import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

import main
from modules.sqlite_repository import SQLiteRepository


class QuizPersistenceTests(unittest.TestCase):
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

    def test_submit_quiz_persists_server_calculated_attempt(self):
        request = main.QuizSubmissionRequest(
            lesson_id="day1_welcome",
            answers={"1": 0, "2": 1, "3": 2},
        )
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ):
            first = main.submit_quiz("alice", request)
            second = main.submit_quiz("alice", request)

        self.assertEqual(first["user_id"], self.repository.get_user_id("alice"))
        self.assertEqual(first["lesson_id"], "day1_welcome")
        self.assertEqual(first["score_percent"], 100.0)
        self.assertEqual(first["correct_answers"], 3)
        self.assertEqual(first["total_questions"], 3)
        self.assertEqual(first["attempt_number"], 1)
        self.assertEqual(second["attempt_number"], 2)

        with self.repository.connect() as connection:
            count = connection.execute(
                "SELECT COUNT(*) FROM quiz_attempts WHERE user_id = ?",
                (self.repository.get_user_id("alice"),),
            ).fetchone()[0]
        self.assertEqual(count, 2)

    def test_users_have_independent_quiz_attempts(self):
        request = main.QuizSubmissionRequest(
            lesson_id="day1_welcome",
            answers={"1": 0, "2": 0, "3": 2},
        )
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ):
            main.submit_quiz("alice", request)
            main.submit_quiz("bob", request)

        with self.repository.connect() as connection:
            rows = connection.execute(
                "SELECT user_id, lesson_id, score_percent FROM quiz_attempts "
                "ORDER BY user_id"
            ).fetchall()
        self.assertEqual(
            [(row["user_id"], row["lesson_id"], row["score_percent"]) for row in rows],
            [
                (self.repository.get_user_id("alice"), "day1_welcome", 66.67),
                (self.repository.get_user_id("bob"), "day1_welcome", 66.67),
            ],
        )

    def test_invalid_or_incomplete_quiz_is_rejected(self):
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ):
            with self.assertRaises(HTTPException) as invalid_lesson:
                main.submit_quiz(
                    "alice",
                    main.QuizSubmissionRequest(
                        lesson_id="not-a-real-lesson", answers={"1": 0}
                    ),
                )
            self.assertEqual(invalid_lesson.exception.status_code, 404)

            with self.assertRaises(HTTPException) as incomplete_quiz:
                main.submit_quiz(
                    "alice",
                    main.QuizSubmissionRequest(
                        lesson_id="day1_welcome", answers={"1": 0}
                    ),
                )
            self.assertEqual(incomplete_quiz.exception.status_code, 400)


if __name__ == "__main__":
    unittest.main()