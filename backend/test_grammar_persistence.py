import json
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from fastapi import HTTPException

import main
from modules.sqlite_repository import SQLiteRepository


class GrammarPersistenceTests(unittest.TestCase):
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

    def call_route(self, username, text, analysis):
        request = main.GrammarRequest(username=username, text=text)
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ), patch.object(main.nlp, "analyze_text", return_value=analysis):
            return main.check_grammar(request)

    def test_successful_activity_persists_all_fields_and_response_shape(self):
        analysis = {
            "score": 85,
            "issues": ["Sentence needs punctuation"],
            "corrected_sentence": "रामः वनं गच्छति।",
            "correction_summary": "Added punctuation.",
            "breakdown": [{"word": "रामः", "pos": "noun"}],
            "word_count": 3,
            "translation": "Rama goes to the forest.",
            "analysis_mode": "Basic",
            "ai_verified": False,
        }
        response = self.call_route("alice", "रामः वनं गच्छति", analysis)
        user_id = self.repository.get_user_id("alice")

        self.assertEqual(response, analysis)
        with self.repository.connect() as connection:
            row = connection.execute(
                "SELECT * FROM grammar_attempts WHERE user_id = ?",
                (user_id,),
            ).fetchone()
        self.assertEqual(row["user_id"], user_id)
        self.assertEqual(row["input_text"], "रामः वनं गच्छति")
        self.assertEqual(row["score_percent"], 85)
        self.assertEqual(row["word_count"], 3)
        self.assertEqual(row["issue_count"], 1)
        self.assertEqual(row["analysis_mode"], "Basic")
        self.assertEqual(json.loads(row["result_json"]), analysis)
        self.assertTrue(row["created_at"])

    def test_users_have_independent_histories(self):
        analysis = {
            "score": 100,
            "issues": [],
            "word_count": 2,
            "analysis_mode": "Groq AI Engine",
        }
        self.call_route("alice", "रामः गच्छति।", analysis)
        self.call_route("bob", "सीता पठति।", analysis)

        with self.repository.connect() as connection:
            rows = connection.execute(
                "SELECT user_id, input_text FROM grammar_attempts ORDER BY user_id"
            ).fetchall()
        self.assertEqual(
            [(row["user_id"], row["input_text"]) for row in rows],
            [
                (self.repository.get_user_id("alice"), "रामः गच्छति।"),
                (self.repository.get_user_id("bob"), "सीता पठति।"),
            ],
        )
        alice_history = list(
            self.repository.list_grammar_activities(self.repository.get_user_id("alice"))
        )
        self.assertEqual(len(alice_history), 1)

    def test_history_is_newest_first(self):
        user_id = self.repository.get_user_id("alice")
        self.repository.record_grammar_activity(
            user_id, "old", 70, "Basic", 1, 2, {"score": 70},
            created_at="2026-09-01T00:00:00+00:00",
        )
        self.repository.record_grammar_activity(
            user_id, "new", 90, "AI Fallback", 1, 1, {"score": 90},
            created_at="2026-09-02T00:00:00+00:00",
        )

        history = list(self.repository.list_grammar_activities(user_id, limit=2))
        self.assertEqual([row["input_text"] for row in history], ["new", "old"])

    def test_ai_fallback_analysis_persists_without_changing_response(self):
        analysis = {
            "score": 70,
            "issues": ["Sentence must end with a Purna Virama (।)", "Review syntax"],
            "corrected_sentence": "रामः गच्छति।",
            "correction_summary": "Review sentence structure.",
            "breakdown": [],
            "word_count": 2,
            "translation": "Rama goes.",
            "analysis_mode": "AI Fallback",
            "ai_verified": False,
        }
        response = self.call_route("alice", "रामः गच्छति", analysis)
        self.assertEqual(response["analysis_mode"], "AI Fallback")
        with self.repository.connect() as connection:
            row = connection.execute(
                "SELECT analysis_mode, issue_count FROM grammar_attempts"
            ).fetchone()
        self.assertEqual(row["analysis_mode"], "AI Fallback")
        self.assertEqual(row["issue_count"], 2)

    def test_invalid_username_is_rejected(self):
        request = main.GrammarRequest(username="missing", text="रामः गच्छति।")
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ):
            with self.assertRaises(HTTPException) as context:
                main.check_grammar(request)
        self.assertEqual(context.exception.status_code, 404)

    def test_empty_analysis_result_is_not_persisted(self):
        response = self.call_route(
            "alice", "", {"error": "Please enter some text to analyze"}
        )
        self.assertEqual(response, {"error": "Please enter some text to analyze"})
        with self.repository.connect() as connection:
            count = connection.execute("SELECT COUNT(*) FROM grammar_attempts").fetchone()[0]
        self.assertEqual(count, 0)

    def test_nlp_error_is_not_persisted(self):
        request = main.GrammarRequest(username="alice", text="रामः")
        with patch.object(main, "learning_db", self.repository), patch.object(
            main.auth, "users", self.users
        ), patch.object(main.nlp, "analyze_text", side_effect=RuntimeError("NLP failed")):
            with self.assertRaises(RuntimeError):
                main.check_grammar(request)
        with self.repository.connect() as connection:
            count = connection.execute("SELECT COUNT(*) FROM grammar_attempts").fetchone()[0]
        self.assertEqual(count, 0)


if __name__ == "__main__":
    unittest.main()