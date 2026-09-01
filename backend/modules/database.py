import os
import json
import pandas as pd
from typing import List, Dict, Optional

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