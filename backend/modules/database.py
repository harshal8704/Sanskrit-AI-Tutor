import os
import json
import pandas as pd
from datetime import datetime
from typing import Dict, List, Any, Optional
from typing import List

class MockDB:
    def __init__(self, data_dir: str = 'data'):
        self.data_dir = data_dir
        self.lessons = self.load_lessons()
        self.vocabulary = self.load_vocabulary()

    def load_lessons(self):
        """Load lessons from the lessons.json file"""
        lessons_file = os.path.join(self.data_dir, 'lessons.json')
        if os.path.exists(lessons_file):
            with open(lessons_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return {"lessons": []}

    def _load_json_list(self, filename: str) -> List[Dict]:
        file_path = os.path.join(self.data_dir, filename)
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_lessons(self) -> List[Dict]:
        data = self.load_lessons()
        return data.get("lessons", []) if isinstance(data, dict) else data

    def load_vocabulary(self):
        """Load vocabulary from CSV files"""
        # Load main dictionary
        main_csv = os.path.join(self.data_dir, 'sanskrit_translation_db.csv')
        if os.path.exists(main_csv):
            df = pd.read_csv(main_csv, encoding='utf-8')
            return df.to_dict('records')
        return []

    def load_all_lessons(self):
        """Load all 35 lessons from the new structured folders"""
        lessons = []
        modules = [
            'module_1_foundations',
            'module_2_building',
            'module_3_nouns',
            'module_4_tenses',
            'module_5_grammar',
            'module_6_syntax',
            'module_7_advanced'
        ]

        for module in modules:
            module_path = os.path.join(self.data_dir, 'lessons', module)
            if os.path.exists(module_path):
                for file in os.listdir(module_path):
                    if file.endswith('.json'):
                        file_path = os.path.join(module_path, file)
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                lesson = json.load(f)
                                lesson['module'] = module
                                lesson['file'] = file
                                lessons.append(lesson)
                        except Exception as e:
                            print(f"Error loading {file}: {e}")

        return lessons

    def get_greetings(self):
        """Get greetings lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritGreetings.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []
    # ─── Lesson Data Accessors ─────────────────────────────
    # All use the shared _load_json_list helper for DRY code.

    def get_greetings(self) -> List[Dict]:
        """Get all greetings"""
        return self._load_json_list('sanskritGreetings.json')

    def get_numbers(self) -> List[Dict]:
        """Get number lesson data"""
        return self._load_json_list('sanskritNumbers.json')

    def get_self_intro(self) -> List[Dict]:
        """Get self introduction lesson data"""
        return self._load_json_list('sanskritSelfIntro.json')

    def get_pronouns(self) -> List[Dict]:
        """Get pronoun lesson data"""
        return self._load_json_list('sanskritPronouns.json')

    def get_verbs(self) -> List[Dict]:
        """Get verb lesson data"""
        return self._load_json_list('sanskritVerbs.json')

    def get_nouns(self) -> List[Dict]:
        """Get noun lesson data"""
        return self._load_json_list('sanskritNouns.json')

    def get_family(self) -> List[Dict]:
        """Get family lesson data"""
        return self._load_json_list('sanskritFamily.json')

    def get_question_words(self) -> List[Dict]:
        """Get question words lesson data"""
        return self._load_json_list('sanskritQuestionWords.json')

    def get_time_and_days(self) -> List[Dict]:
        """Get time and days lesson data"""
        return self._load_json_list('sanskritTimeAndDays.json')

    def get_vibhakti(self):
        """Get vibhakti data"""
        return self._load_json_list('sanskritVibhakti.json')

    def get_sandhi(self):
        """Get sandhi data"""
        return self._load_json_list('sanskritSandhi.json')

    def get_tenses(self):
        """Get verb tense data"""
        return self._load_json_list('sanskritTenses.json')

    def get_moods(self):
        """Get verb moods data (Imperative & Optative)"""
        return self._load_json_list('sanskritMoods.json')

    def get_pronouns_extended(self):
        """Get extended pronouns (dual & plural) data"""
        return self._load_json_list('sanskritPronounsExtended.json')

    def get_upasarga(self):
        """Get upasarga (verbal prefix) data"""
        return self._load_json_list('sanskritUpasarga.json')

    def get_voice(self):
        """Get active/passive voice data"""
        return self._load_json_list('sanskritVoice.json')

    def get_indeclinables(self):
        """Get indeclinables (avyaya) data"""
        return self._load_json_list('sanskritIndeclinables.json')

    def get_participles(self):
        """Get participles data"""
        return self._load_json_list('sanskritParticiples.json')

    def get_reading_composition(self):
        """Get reading and composition data"""
        return self._load_json_list('sanskritReadingComposition.json')

    def get_samasa1(self):
        """Get Samāsa (compounds) Part 1 data"""
        return self._load_json_list('sanskritSamasa1.json')

    def get_samasa2(self):
        return self._load_json_list('sanskritSamasa2.json')

    def get_participles2(self):
        return self._load_json_list('sanskritParticiples2.json')

    def get_stri_pratyaya(self):
        return self._load_json_list('sanskritStriPratyaya.json')

    def get_chandas(self):
        return self._load_json_list('sanskritChandas.json')

    def get_numbers(self):
        """Get numbers lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritNumbers.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_self_intro(self):
        """Get self introduction lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritSelfIntro.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_pronouns(self):
        """Get pronouns lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritPronouns.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_verbs(self):
        """Get verbs lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritVerbs.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_nouns(self):
        """Get nouns lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritNouns.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_family(self):
        """Get family lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritFamily.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_question_words(self):
        """Get question words lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritQuestionWords.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_time_and_days(self):
        """Get time and days lesson data"""
        file_path = os.path.join(self.data_dir, 'sanskritTimeAndDays.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_daily_questions(self):
        """Get daily questions data"""
        file_path = os.path.join(self.data_dir, 'dailyQuestions.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_snake_ladder_words(self):
        """Get snake ladder words"""
        file_path = os.path.join(self.data_dir, 'snakeLadderWords.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_odd_one_out_words(self):
        """Get odd one out words"""
        file_path = os.path.join(self.data_dir, 'oddOneOutWords.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_user_progress(self, username: str):
        """Get user progress"""
        file_path = os.path.join(self.data_dir, 'user_progress.json')
        if os.path.exists(file_path):
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data.get('users', {}).get(username, {})
        return {}

    def get_recent_activities(self, username: str):
        """Get recent activities"""
        progress = self.get_user_progress(username)
        return progress.get('interactions', [])[:10]

        # Default progress — total_lessons reflects actual curriculum size
        return {
            "username": username,
            "total_lessons": 20,
            "completed": 0,
            "in_progress": 2,
            "avg_score": 0,
            "streak_days": 0
        }

    def update_progress(self, username: str, lesson_id: int, status: str):
        """Update user progress"""
        progress_file = os.path.join(self.data_dir, f'{username}_progress.json')

        progress = self.get_user_progress(username)

        if status == 'completed':
            progress['completed'] = progress.get('completed', 0) + 1
        elif status == 'started':
            progress['in_progress'] = progress.get('in_progress', 0) + 1

        # Save progress
        with open(progress_file, 'w') as f:
            json.dump(progress, f, indent=2)

        return progress

    def save_analysis(self, username: str, text: str, analysis: Dict):
        """Save grammar analysis"""
        analysis_file = os.path.join(self.data_dir, f'{username}_analyses.json')

        analyses = []
        if os.path.exists(analysis_file):
            with open(analysis_file, 'r') as f:
                analyses = json.load(f)

        analyses.append({
            "text": text,
            "analysis": analysis,
            "timestamp": datetime.now().isoformat()
        })

        with open(analysis_file, 'w') as f:
            json.dump(analyses, f, indent=2)

    def get_demo_activities(self, username: str) -> List[Dict]:
        """Return legacy demo activities for compatibility only."""
        # Mock activities for prototype
        return [
            {
                "action": "Completed lesson",
                "details": "Sanskrit Alphabet",
                "timestamp": "2 hours ago",
                "score": "90%"
            },
            {
                "action": "Grammar check",
                "details": "रामः वनं गच्छति",
                "timestamp": "1 day ago",
                "score": "85%"
            },
            {
                "action": "Started lesson",
                "details": "Basic Greetings",
                "timestamp": "2 days ago",
                "score": "In progress"
            }
        ]

    def get_all_users(self) -> List[Dict]:
        """Get all users (for admin)"""
        users_file = os.path.join(self.data_dir, 'users.json')

        if os.path.exists(users_file):
            with open(users_file, 'r') as f:
                users_data = json.load(f)
                users = []
                for username, data in users_data.items():
                    users.append({
                        "username": username,
                        "role": data.get("role", "student"),
                        "created_at": data.get("created_at", ""),
                        "level": data.get("level", "beginner")
                    })
                return users

        return []

    # ─── BKT Data Access ────────────────────────────────────────

    def get_bkt_engine(self):
        """Lazy load BKT engine (avoids circular import)."""
        from modules.bkt_engine import BKTEngine
        if not hasattr(self, '_bkt_engine'):
            self._bkt_engine = BKTEngine(data_file=os.path.join(self.data_dir, 'bkt_progress.json'))
        return self._bkt_engine

    def get_bkt_skill_data(self, username: str, skill_id: int) -> Dict:
        """Get BKT data for a specific skill."""
        engine = self.get_bkt_engine()
        return engine.get_user_skill_data(username, skill_id)

    def record_bkt_attempt(self, username: str, skill_id: int, is_correct: bool, difficulty: int = 3) -> Dict:
        """Record a BKT attempt and return updated mastery."""
        engine = self.get_bkt_engine()
        return engine.record_attempt(username, skill_id, is_correct, difficulty)

    def get_bkt_mastery_for_skills(self, username: str, skill_ids: List[int]) -> Dict[int, float]:
        """Get mastery for multiple skills."""
        engine = self.get_bkt_engine()
        return engine.get_mastery_for_skills(username, skill_ids)

    def get_bkt_recommendation(self, username: str):
        """Get the recommended next lesson based on BKT."""
        # Import learning_engine locally to avoid circular imports
        try:
            from main import learning_engine
            lessons = learning_engine.lessons
        except Exception:
            lessons = self.get_lessons()
        return self.get_bkt_engine().get_recommendation(username, lessons)

    def get_bkt_summary(self, username: str) -> Dict:
        """Get BKT summary for the user."""
        engine = self.get_bkt_engine()
        return engine.get_user_summary(username)
