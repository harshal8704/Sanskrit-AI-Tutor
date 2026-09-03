import tempfile
import unittest
from pathlib import Path

import main
from modules.sqlite_repository import SQLiteRepository


class DailyStreakTests(unittest.TestCase):
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

    def test_daily_activity_is_upserted_per_user_day(self):
        user_id = self.repository.get_user_id("alice")
        first = self.repository.record_learning_day(user_id, "2026-09-02", source="lesson")
        second = self.repository.record_learning_day(user_id, "2026-09-02", source="quiz")

        self.assertTrue(first["created"])
        self.assertFalse(second["created"])
        with self.repository.connect() as connection:
            rows = connection.execute(
                "SELECT user_id, activity_date, challenge_id, completed FROM daily_activity WHERE user_id = ? ORDER BY activity_date",
                (user_id,),
            ).fetchall()
        self.assertEqual(len(rows), 1)
        self.assertEqual(rows[0]["activity_date"], "2026-09-02")

    def test_streak_summary_calculates_current_longest_and_active_days(self):
        user_id = self.repository.get_user_id("alice")
        for day in ["2026-09-01", "2026-09-02", "2026-09-03", "2026-09-06", "2026-09-07"]:
            self.repository.record_learning_day(user_id, day, source="lesson")

        summary = self.repository.get_streak_summary(user_id, as_of_utc_date="2026-09-07")

        self.assertEqual(summary["current_streak"], 2)
        self.assertEqual(summary["longest_streak"], 3)
        self.assertEqual(summary["active_days"], 5)

    def test_user_streak_route_rejects_unknown_or_numeric_user(self):
        with self.assertRaises(ValueError):
            self.repository.get_streak_summary("42")

        with self.assertRaises(ValueError):
            self.repository.get_streak_summary(-1)

        with self.assertRaises(ValueError):
            self.repository.get_streak_summary("alice", as_of_utc_date=123)

        with self.assertRaises(ValueError):
            self.repository.get_streak_summary("alice", as_of_utc_date=123.0)

        self.assertEqual(
            self.repository.get_streak_summary(self.repository.get_user_id("alice")),
            {"current_streak": 0, "longest_streak": 0, "active_days": 0},
        )

        with self.assertRaises(ValueError):
            self.repository.record_learning_day("alice", "2026-09-07")

        with self.assertRaises(Exception):
            with __import__("unittest.mock").mock.patch.object(
                main, "learning_db", self.repository
            ), __import__("unittest.mock").mock.patch.object(
                main.auth, "users", self.users
            ):
                main.get_streak_summary("missing")

        with __import__("unittest.mock").mock.patch.object(
            main, "learning_db", self.repository
        ), __import__("unittest.mock").mock.patch.object(
            main.auth, "users", self.users
        ):
            self.assertEqual(
                main.get_streak_summary("alice"),
                {"current_streak": 0, "longest_streak": 0, "active_days": 0},
            )


if __name__ == "__main__":
    unittest.main()
