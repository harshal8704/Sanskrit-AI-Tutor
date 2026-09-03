import sqlite3
import tempfile
import unittest
from pathlib import Path

from modules.sqlite_repository import SQLiteRepository


class SQLiteRepositoryTests(unittest.TestCase):
    def test_initializes_schema_and_migrates_users_idempotently(self):
        with tempfile.TemporaryDirectory() as directory:
            database_path = str(Path(directory) / "progress.sqlite3")
            repository = SQLiteRepository(database_path)
            users = {
                "demo": {
                    "password": "hashed_demo",
                    "role": "student",
                    "level": "beginner",
                    "created_at": "2026-09-02T00:00:00",
                }
            }

            repository.initialize()
            self.assertEqual(repository.migrate_users(users), 1)
            self.assertEqual(repository.migrate_users(users), 0)

            with repository.connect() as connection:
                tables = {
                    row[0]
                    for row in connection.execute(
                        "SELECT name FROM sqlite_master WHERE type = 'table'"
                    )
                }
                self.assertTrue(
                    {
                        "users",
                        "lesson_completions",
                        "quiz_attempts",
                        "grammar_attempts",
                        "daily_activity",
                        "xp_transactions",
                    }.issubset(tables)
                )
                self.assertEqual(connection.execute("SELECT COUNT(*) FROM users").fetchone()[0], 1)

                for table in (
                    "lesson_completions",
                    "quiz_attempts",
                    "grammar_attempts",
                    "daily_activity",
                    "xp_transactions",
                ):
                    foreign_keys = connection.execute(
                        f"PRAGMA foreign_key_list({table})"
                    ).fetchall()
                    self.assertTrue(any(row[2] == "users" for row in foreign_keys))

                connection.execute(
                    "INSERT INTO lesson_completions "
                    "(user_id, lesson_id, completed_at, source) VALUES (1, 'day1', 'now', 'test')"
                )
                with self.assertRaises(sqlite3.IntegrityError):
                    connection.execute(
                        "INSERT INTO lesson_completions "
                        "(user_id, lesson_id, completed_at, source) VALUES (1, 'day1', 'now', 'test')"
                    )

                connection.execute(
                    "INSERT INTO daily_activity "
                    "(user_id, activity_date, challenge_id, completed) VALUES (1, '2026-09-02', 'day1', 1)"
                )
                with self.assertRaises(sqlite3.IntegrityError):
                    connection.execute(
                        "INSERT INTO daily_activity "
                        "(user_id, activity_date, challenge_id, completed) VALUES (1, '2026-09-02', 'day1', 1)"
                    )

                connection.execute(
                    "INSERT INTO xp_transactions "
                    "(user_id, amount, reason, source_type, source_id, idempotency_key, created_at) "
                    "VALUES (1, 10, 'test', 'test', '1', 'key-1', 'now')"
                )
                with self.assertRaises(sqlite3.IntegrityError):
                    connection.execute(
                        "INSERT INTO xp_transactions "
                        "(user_id, amount, reason, source_type, source_id, idempotency_key, created_at) "
                        "VALUES (1, 10, 'test', 'test', '1', 'key-1', 'now')"
                    )


if __name__ == "__main__":
    unittest.main()