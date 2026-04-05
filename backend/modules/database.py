"""
Mock database for SanskritaAI prototype
Uses JSON files instead of real database
"""

import json
import os
from datetime import datetime
from typing import Dict, List, Any

class MockDB:
    def __init__(self, data_dir='data'):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
    
    def get_lessons(self) -> List[Dict]:
        """Get all lessons"""
        lessons_file = os.path.join(self.data_dir, 'lessons.json')
        
        if os.path.exists(lessons_file):
            with open(lessons_file, 'r') as f:
                return json.load(f)['lessons']
        
        # Return default lessons
        return [
            {
                "id": 1,
                "title": "Sanskrit Alphabet (Devanagari)",
                "level": "beginner",
                "duration": 10,
                "content": "Learn the 13 vowels and 33 consonants of Sanskrit...",
                "quiz": [
                    {
                        "id": 1,
                        "question": "How many vowels in Sanskrit?",
                        "options": ["10", "13", "15", "20"],
                        "answer": "13"
                    }
                ]
            },
            {
                "id": 2,
                "title": "Basic Greetings",
                "level": "beginner",
                "duration": 15,
                "content": "Learn common greetings: नमस्ते (Hello), सुप्रभातम् (Good morning)...",
                "quiz": [
                    {
                        "id": 1,
                        "question": "What does 'नमस्ते' mean?",
                        "options": ["Thank you", "Hello", "Goodbye", "Please"],
                        "answer": "Hello"
                    }
                ]
            }
        ]
    
    def get_greetings(self) -> List[Dict]:
        """Get all greetings"""
        greetings_file = os.path.join(self.data_dir, 'sanskritGreetings.json')
        
        if os.path.exists(greetings_file):
            with open(greetings_file, 'r', encoding='utf-8') as f:
                return json.load(f)

    def get_numbers(self) -> List[Dict]:
        """Get all numbers limit to JSON file."""
        numbers_file = os.path.join(self.data_dir, 'sanskritNumbers.json')
        if os.path.exists(numbers_file):
            with open(numbers_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_self_intro(self) -> List[Dict]:
        """Get self intro data"""
        intro_file = os.path.join(self.data_dir, 'sanskritSelfIntro.json')
        if os.path.exists(intro_file):
            with open(intro_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_pronouns(self) -> List[Dict]:
        """Get pronouns data"""
        pronouns_file = os.path.join(self.data_dir, 'sanskritPronouns.json')
        if os.path.exists(pronouns_file):
            with open(pronouns_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_verbs(self) -> List[Dict]:
        """Get verbs data"""
        verbs_file = os.path.join(self.data_dir, 'sanskritVerbs.json')
        if os.path.exists(verbs_file):
            with open(verbs_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_nouns(self) -> List[Dict]:
        """Get nouns data for genders lesson"""
        nouns_file = os.path.join(self.data_dir, 'sanskritNouns.json')
        if os.path.exists(nouns_file):
            with open(nouns_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_family(self) -> List[Dict]:
        """Get family relationship words"""
        family_file = os.path.join(self.data_dir, 'sanskritFamily.json')
        if os.path.exists(family_file):
            with open(family_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_question_words(self) -> List[Dict]:
        """Get question words (prashna padas)"""
        qw_file = os.path.join(self.data_dir, 'sanskritQuestionWords.json')
        if os.path.exists(qw_file):
            with open(qw_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_time_and_days(self) -> List[Dict]:
        """Get time and days vocabulary"""
        td_file = os.path.join(self.data_dir, 'sanskritTimeAndDays.json')
        if os.path.exists(td_file):
            with open(td_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_daily_questions(self) -> List[Dict]:
        """Get daily streak questions"""
        questions_file = os.path.join(self.data_dir, 'dailyQuestions.json')
        if os.path.exists(questions_file):
            with open(questions_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_snake_ladder_words(self) -> List[Dict]:
        """Get snake & ladder words dataset"""
        words_file = os.path.join(self.data_dir, 'snakeLadderWords.json')
        if os.path.exists(words_file):
            with open(words_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_odd_one_out_words(self) -> List[Dict]:
        """Get odd one out words dataset"""
        words_file = os.path.join(self.data_dir, 'oddOneOutWords.json')
        if os.path.exists(words_file):
            with open(words_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        return []

    def get_user_progress(self, username: str) -> Dict:
        """Get user progress"""
        progress_file = os.path.join(self.data_dir, f'{username}_progress.json')
        
        if os.path.exists(progress_file):
            with open(progress_file, 'r') as f:
                return json.load(f)
        
        # Default progress
        return {
            "username": username,
            "total_lessons": 10,
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
    
    def get_recent_activities(self, username: str) -> List[Dict]:
        """Get recent user activities"""
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