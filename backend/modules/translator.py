"""
Enhanced Translator for SanskritaAI with Dynamic Dataset and Sentence Generation
Includes free API fallback and automatic database expansion
"""

import pandas as pd
import random
import json
import os
import requests
from datetime import datetime
from typing import List, Dict, Optional

# Try to import Google Translator
try:
    from deep_translator import GoogleTranslator
    DEEP_TRANSLATOR_AVAILABLE = True
except ImportError:
    DEEP_TRANSLATOR_AVAILABLE = False
    print("deep-translator not installed. Run: pip install deep-translator")

from dotenv import load_dotenv
import re

# Load environment variables explicitly
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

class SanskritTranslator:
    def __init__(self, csv_path='data/sanskrit_words.csv', sentences_path='data/sanskrit_sentences.json'):
        # Ensure paths are relative to the backend root or absolute
        self.csv_path = csv_path
        
        # Robust path generation relative to where the script is run / located
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        self.main_db_path = os.path.join(base_dir, 'data', 'sanskrit_translation_db.csv')
        self.sentences_path = sentences_path
        
        self.main_df = self.load_main_db()
        self.new_words_df = self.load_data()
        
        # Merge both databases into memory for lightning-fast lookups
        if not self.main_df.empty and not self.new_words_df.empty:
            self.df = pd.concat([self.main_df, self.new_words_df], ignore_index=True)
        elif not self.main_df.empty:
            self.df = self.main_df
        else:
            self.df = self.new_words_df
            
        self.sentences = self.load_sentences()
        self.api_calls_today = 0
        self.max_api_calls = 100  # Free API limits
        
        self.ai_provider: str = "Local"
        self.ai_model: str = "None"
        
        # AI Configuration - Support both xAI (Grok) and Groq (gsk_...)
        self.api_key = os.getenv("XAI_API_KEY")
        self.base_url = os.getenv("BASE_URL")
        
        if self.api_key and isinstance(self.api_key, str):
            if self.api_key.startswith("gsk_"):
                self.ai_provider = "Groq"
                self.base_url = "https://api.groq.com/openai/v1" # Force Groq URL
                self.ai_model = "llama-3.3-70b-versatile"
            else:
                self.ai_provider = "Grok"
                self.base_url = self.base_url or "https://api.x.ai/v1"
                self.ai_model = "grok-beta"
            print(f"SanskritTranslator: AI Engine initialized ({self.ai_provider})")
        else:
            print("SanskritTranslator: AI Engine key NOT found.")
    def load_main_db(self):
        """Load the massive core dictionary of Sanskrit"""
        try:
            if os.path.exists(self.main_db_path):
                df = pd.read_csv(self.main_db_path, encoding='utf-8')
                df = df.fillna('')  # CRITICAL: Prevent NaN JSON errors
                mapping = {
                    'sanskrit_word': 'sanskrit',
                    'pos': 'word_type',
                    'example_meaning': 'meaning'
                }
                df = df.rename(columns=mapping)
                if 'pronunciation' not in df.columns:
                    df['pronunciation'] = df['sanskrit']
                if 'source' not in df.columns:
                    df['source'] = 'translation_db'
                if 'tags' not in df.columns:
                    df['tags'] = 'database'
                
                # Force all columns to strings to avoid numeric/NaN issues
                for col in df.columns:
                    df[col] = df[col].astype(str)
                
                print(f"✅ Loaded {len(df)} core Sanskrit words from main dictionary")
                return df
            return pd.DataFrame()
        except Exception as e:
            print(f"Error loading main DB: {e}")
            return pd.DataFrame()

    def load_data(self):
        """Load generated/API-translated Sanskrit words from CSV"""
        try:
            if os.path.exists(self.csv_path):
                df = pd.read_csv(self.csv_path, encoding='utf-8')
                df = df.fillna('')  # CRITICAL: Prevent NaN JSON errors
                required_columns = ['sanskrit', 'devanagari', 'english', 'pronunciation', 
                                  'word_type', 'meaning', 'example', 'category', 'tags', 'source']
                
                for col in required_columns:
                    if col not in df.columns:
                        df[col] = ''
                
                # Safeguard against any float/NaN sneaking in
                for col in df.columns:
                    if col in required_columns:
                        df[col] = df[col].astype(str)
                
                print(f"✅ Loaded {len(df)} newly learned Sanskrit words from user dictionary")
                return df
            else:
                print("CSV file not found. Creating new dataset with demo data.")
                return self.create_demo_data()
        except Exception as e:
            print(f"Error loading CSV: {e}")
            return self.create_demo_data()
    
    def load_sentences(self):
        """Load sentences from JSON"""
        try:
            if os.path.exists(self.sentences_path):
                with open(self.sentences_path, 'r', encoding='utf-8') as f:
                    return json.load(f)
            else:
                default_sentences = {
                    "sentences": self.generate_default_sentences(),
                    "patterns": self.generate_patterns()
                }
                self.save_sentences(default_sentences)
                return default_sentences
        except Exception as e:
            print(f"Error loading sentences: {e}")
            return {"sentences": [], "patterns": []}
    
    def generate_default_sentences(self):
        """Generate default sentence patterns"""
        return [
            {
                "id": 1,
                "sanskrit": "रामः वनं गच्छति।",
                "devanagari": "रामः वनं गच्छति।",
                "translation": "Rama goes to the forest.",
                "words": ["रामः", "वनं", "गच्छति"],
                "pattern": "Subject Object Verb",
                "difficulty": "beginner",
                "tags": ["action", "movement"],
                "created_at": datetime.now().isoformat()
            },
            {
                "id": 2,
                "sanskrit": "सीता फलं खादति।",
                "devanagari": "सीता फलं खादति।",
                "translation": "Sita eats fruit.",
                "words": ["सीता", "फलं", "खादति"],
                "pattern": "Subject Object Verb",
                "difficulty": "beginner",
                "tags": ["action", "eating"],
                "created_at": datetime.now().isoformat()
            }
        ]
    
    def generate_patterns(self):
        """Generate sentence patterns"""
        return [
            {
                "pattern": "Subject Object Verb",
                "template": "{subject} {object} {verb}।",
                "examples": ["रामः वनं गच्छति।", "सीता फलं खादति।"]
            },
            {
                "pattern": "Subject Verb",
                "template": "{subject} {verb}।",
                "examples": ["सीता अस्ति।", "वर्षा भवति।"]
            }
        ]
    
    def create_demo_data(self):
        """Create enhanced demo data"""
        data = {
            'sanskrit': ['agniḥ', 'jalaṃ', 'vāyuḥ', 'bhūmiḥ', 'sūryaḥ', 'candraḥ', 
                        'putraḥ', 'phalam', 'granthaḥ', 'gacchati', 'asti', 'khādati'],
            'devanagari': ['अग्निः', 'जलं', 'वायुः', 'भूमिः', 'सूर्यः', 'चन्द्रः',
                          'पुत्रः', 'फलम्', 'ग्रन्थः', 'गच्छति', 'अस्ति', 'खादति'],
            'english': ['fire', 'water', 'air', 'earth', 'sun', 'moon',
                       'son', 'fruit', 'book', 'goes', 'is', 'eats'],
            'pronunciation': ['agniḥ', 'jalam', 'vāyuḥ', 'bhūmiḥ', 'sūryaḥ', 'candraḥ',
                            'putraḥ', 'phalam', 'granthaḥ', 'gacchati', 'asti', 'khādati'],
            'word_type': ['noun', 'noun', 'noun', 'noun', 'noun', 'noun',
                          'noun', 'noun', 'noun', 'verb', 'verb', 'verb'],
            'meaning': ['fire; heat', 'water; fluid', 'air; wind', 'earth; ground', 'sun', 'moon',
                       'son; child', 'fruit', 'book; text', 'to go; to move', 'to be; exists', 'to eat'],
            'example': ['अग्निः उष्णः अस्ति।', 'जलं शीतलं अस्ति।', 'वायुः वहति।', 
                       'भूमिः स्थिरा अस्ति।', 'सूर्यः उदेति।', 'चन्द्रः शोभते।',
                       'पुत्रः पठति।', 'फलं मधुरम् अस्ति।', 'ग्रन्थः विशालः अस्ति।',
                       'रामः गच्छति।', 'सीता अस्ति।', 'बालः खादति।'],
            'category': ['elements', 'elements', 'elements', 'elements', 'celestial', 'celestial',
                        'family', 'food', 'objects', 'actions', 'actions', 'actions'],
            'tags': ['basic,fire', 'basic,water', 'basic,air', 'basic,earth', 'sun,celestial', 'moon,celestial',
                    'family,people', 'food,fruit', 'education,objects', 'verb,movement', 'verb,existence', 'verb,eating'],
            'source': ['database'] * 12
        }
        return pd.DataFrame(data)
    
    def save_sentences(self, sentences_data=None):
        """Save sentences to JSON"""
        if sentences_data is None:
            sentences_data = self.sentences
        
        os.makedirs(os.path.dirname(self.sentences_path), exist_ok=True)
        with open(self.sentences_path, 'w', encoding='utf-8') as f:
            json.dump(sentences_data, f, ensure_ascii=False, indent=2)
    
    def translate_with_deep_translator(self, text, source='en', target='sa'):
        """Translate using deep-translator GoogleTranslator"""
        if not DEEP_TRANSLATOR_AVAILABLE:
            return None
        
        try:
            translator = GoogleTranslator(source=source, target=target)
            translation = translator.translate(text)
            
            if translation and translation != text:
                # If it's a sentence, the primary meaning is the translation itself
                is_sentence = ' ' in text.strip() or len(text) > 20
                meanings = [translation] if is_sentence else [f"Translation of {text}"]
                
                return {
                    'sanskrit': translation if target == 'sa' else text,
                    'devanagari': translation if target == 'sa' else text,
                    'english': translation if target == 'en' else text,
                    'pronunciation': translation,
                    'word_type': 'sentence' if is_sentence else 'noun',
                    'meanings': meanings,
                    'example': '',
                    'category': 'api-added',
                    'source': 'google_api'
                }
        except Exception as e:
            print(f"Deep translator error: {e}")
        return None
    
    def translate_with_mymemory(self, text, source='en', target='sa'):
        """Translate using MyMemory Translation API (free)"""
        try:
            url = "https://api.mymemory.translated.net/get"
            params = {
                'q': text,
                'langpair': f'{source}|{target}'
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if response.status_code == 200 and data['responseStatus'] == 200:
                translation = data['responseData']['translatedText']
                translation = translation.replace('&#39;', "'").replace('&quot;', '"')
                
                if translation and translation != text:
                    is_sentence = ' ' in text.strip() or len(text) > 20
                    meanings = [translation] if is_sentence else [f"Translation of {text}"]
                    
                    return {
                        'sanskrit': translation if target == 'sa' else text,
                        'devanagari': translation if target == 'sa' else text,
                        'english': translation if target == 'en' else text,
                        'pronunciation': translation,
                        'word_type': 'sentence' if is_sentence else 'noun',
                        'meanings': meanings,
                        'example': '',
                        'category': 'api-added',
                        'source': 'mymemory_api'
                    }
        except Exception as e:
            print(f"MyMemory API error: {e}")
        return None
    
    def translate_with_libretranslate(self, text, source='en', target='sa'):
        """Translate using LibreTranslate API (free, no key needed)"""
        try:
            url = "https://libretranslate.com/translate"
            payload = {
                'q': text,
                'source': source,
                'target': target,
                'format': 'text'
            }
            
            response = requests.post(url, json=payload, timeout=10)
            data = response.json()
            
            if response.status_code == 200 and 'translatedText' in data:
                translation = data['translatedText']
                
                if translation and translation != text:
                    is_sentence = ' ' in text.strip() or len(text) > 20
                    meanings = [translation] if is_sentence else [f"Translation of {text}"]
                    
                    return {
                        'sanskrit': translation if target == 'sa' else text,
                        'devanagari': translation if target == 'sa' else text,
                        'english': translation if target == 'en' else text,
                        'pronunciation': translation,
                        'word_type': 'sentence' if is_sentence else 'noun',
                        'meanings': meanings,
                        'example': '',
                        'category': 'api-added',
                        'source': 'libretranslate_api'
                    }
        except Exception as e:
            print(f"LibreTranslate error: {e}")
        return None
    def translate_with_ai(self, text, direction='en_to_sa'):
        """Professional translation using Grok/Groq AI"""
        if not self.api_key:
            return None
            
        try:
            target_lang = "Sanskrit (Devanagari)" if direction == 'en_to_sa' else "English"
            source_lang = "English" if direction == 'en_to_sa' else "Sanskrit (Devanagari)"
            
            prompt = f"""
            Translate the following {source_lang} text to {target_lang}.
            Text: "{text}"
            
            Provide the result STRICTLY as a JSON object:
            {{
                "sanskrit": "transliterated sanskrit",
                "devanagari": "sanskrit text in devanagari",
                "english": "english translation",
                "pronunciation": "how to pronounce",
                "word_type": "sentence or part of speech",
                "meanings": ["meaning 1", "meaning 2"],
                "example": "an example usage in Sanskrit"
            }}
            """

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.ai_model,
                "messages": [
                    {"role": "system", "content": "You are a professional Sanskrit-English translator with deep knowledge of Vedic and Classical Sanskrit."},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.3
            }

            response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload, timeout=20)
            
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                
                # Robust extraction
                json_match = re.search(r'\{.*\}', content, re.DOTALL)
                if json_match:
                    item = json.loads(json_match.group(0))
                    item['source'] = f'{self.ai_provider}_ai'
                    return item
                    
        except Exception as e:
            print(f"AI Translation Error: {e}")
        return None
    
    def save_to_database(self, word_data):
        """Save new word to database and CSV"""
        try:
            existing = self.df[self.df['english'].str.lower() == word_data['english'].lower()]
            if not existing.empty:
                return False
            
            new_row = pd.DataFrame([{
                'sanskrit': word_data['sanskrit'],
                'devanagari': word_data['devanagari'],
                'english': word_data['english'],
                'pronunciation': word_data.get('pronunciation', word_data['sanskrit']),
                'word_type': word_data.get('word_type', 'noun'),
                'meaning': '; '.join(word_data.get('meanings', [word_data['english']])),
                'example': word_data.get('example', ''),
                'category': word_data.get('category', 'api-added'),
                'tags': f"api,{word_data.get('source', 'unknown')}",
                'source': word_data.get('source', 'api')
            }])
            
            self.df = pd.concat([self.df, new_row], ignore_index=True)
            self.new_words_df = pd.concat([self.new_words_df, new_row], ignore_index=True)
            self.new_words_df.to_csv(self.csv_path, index=False, encoding='utf-8')
            self.generate_sentences_for_word(word_data)
            return True
        except Exception as e:
            print(f"Error saving to database: {e}")
            return False
    
    def generate_sentences_for_word(self, word_data):
        """Generate example sentences for new word"""
        word = word_data['sanskrit']
        English = word_data['english']
        
        templates = [
            f"{word} अस्ति।",
            f"{word} गच्छति।",
            f"{word} पठति।",
        ]
        
        translations = [
            f"{English.title()} is.",
            f"{English.title()} goes.",
            f"{English.title()} reads.",
        ]
        
        new_sentences = []
        for i, (sans, trans) in enumerate(zip(templates, translations)):
            new_sentences.append({
                "id": len(self.sentences['sentences']) + i + 1,
                "sanskrit": sans,
                "devanagari": sans,
                "translation": trans,
                "words": [word],
                "pattern": "Subject Verb",
                "difficulty": "beginner",
                "tags": ["auto-generated", "api-added"],
                "created_at": datetime.now().isoformat()
            })
        
        self.sentences['sentences'].extend(new_sentences)
        self.save_sentences()
        return new_sentences
    
    def English_to_sanskrit(self, English_word: str, use_api: bool = True) -> Dict:
        """Convert English to Sanskrit with API fallback and auto-save"""
        English_word = English_word.lower().strip()
        results = []
        
        for _, row in self.df.iterrows():
            row_english = str(row.get('english', '')).strip().lower()
            if English_word == row_english and row_english != 'nan' and row_english != '':
                # Sanitize meanigns and example to avoid NaN floats in JSON
                meaning_val = row.get('meaning', '')
                meanings = str(meaning_val).split('; ') if pd.notna(meaning_val) else [str(row.get('english', ''))]
                
                results.append({
                    'sanskrit': str(row.get('sanskrit', '')),
                    'devanagari': str(row.get('devanagari', '')),
                    'english': str(row.get('english', '')),
                    'pronunciation': str(row.get('pronunciation', '')),
                    'word_type': str(row.get('word_type', '')),
                    'meanings': meanings,
                    'example': str(row.get('example', '')) if pd.notna(row.get('example')) else '',
                    'category': str(row.get('category', '')),
                    'source': str(row.get('source', 'database'))
                })
        
        if results:
            return {'source': 'database', 'results': results, 'count': len(results)}
        
        if use_api:
            print(f"🌐 Using AI Engine for '{English_word}'...")
            
            # Prefer premium AI if available
            api_result = self.translate_with_ai(English_word, direction='en_to_sa')
            
            # Fallback to free APIs if premium AI fails or isn't available
            if not api_result and self.api_calls_today < self.max_api_calls:
                if DEEP_TRANSLATOR_AVAILABLE:
                    api_result = self.translate_with_deep_translator(English_word, source='en', target='sa')
                if not api_result:
                    api_result = self.translate_with_mymemory(English_word, source='en', target='sa')
                if not api_result:
                    api_result = self.translate_with_libretranslate(English_word, source='en', target='sa')
            
            if api_result:
                self.api_calls_today += 1
                if self.save_to_database(api_result):
                    # Instead of full recursion, let's just return the result properly tagged
                    # to avoid duplicate DB calls in the same request
                    api_result['source'] = f"{api_result.get('source', 'api')} (saved)"
                    return {'source': 'database', 'results': [api_result], 'count': 1}
                else:
                    return {'source': 'api', 'results': [api_result], 'count': 1}
        
        return {'source': 'none', 'results': [], 'count': 0}

    def sanskrit_to_English(self, sanskrit_word: str, use_api: bool = True) -> Dict:
        """Convert Sanskrit to English with API fallback and auto-save"""
        sanskrit_word = sanskrit_word.strip()
        results = []
        
        # Exact match or broad match in database
        for _, row in self.df.iterrows():
            s_val = str(row.get('sanskrit', '')).strip().lower()
            d_val = str(row.get('devanagari', '')).strip()
            
            # Match against transliterated sanskrit or devanagari
            if s_val != 'nan' and (sanskrit_word.lower() == s_val or 
                sanskrit_word == d_val or
                sanskrit_word.lower() in s_val or
                sanskrit_word in d_val):
                
                # Sanitize meanigns and example
                meaning_val = row.get('meaning', '')
                meanings = str(meaning_val).split('; ') if pd.notna(meaning_val) else [str(row.get('english', ''))]
                
                results.append({
                    'sanskrit': str(row.get('sanskrit', '')),
                    'devanagari': str(row.get('devanagari', '')),
                    'english': str(row.get('english', '')),
                    'pronunciation': str(row.get('pronunciation', '')),
                    'word_type': str(row.get('word_type', '')),
                    'meanings': meanings,
                    'example': str(row.get('example', '')) if pd.notna(row.get('example')) else '',
                    'category': str(row.get('category', '')),
                    'source': str(row.get('source', 'database'))
                })
        
        if results:
            return {'source': 'database', 'results': results, 'count': len(results)}
        
        if use_api:
            print(f"🌐 Using AI Engine for Sanskrit '{sanskrit_word}'...")
            
            # Prefer premium AI
            api_result = self.translate_with_ai(sanskrit_word, direction='sa_to_en')
            
            # Fallback to free APIs
            if not api_result and self.api_calls_today < self.max_api_calls:
                if DEEP_TRANSLATOR_AVAILABLE:
                    api_result = self.translate_with_deep_translator(sanskrit_word, source='sa', target='en')
                if not api_result:
                    api_result = self.translate_with_mymemory(sanskrit_word, source='sa', target='en')
                if not api_result:
                    api_result = self.translate_with_libretranslate(sanskrit_word, source='sa', target='en')
                
            if api_result:
                self.api_calls_today += 1
                
                english_translation = api_result.get('english', '')
                if not english_translation and api_result.get('meanings'):
                    english_translation = api_result['meanings'][0]
                
                # Check if the API just returned the same word (failed to translate)
                if str(english_translation).strip().lower() == str(sanskrit_word).strip().lower():
                    return {'source': 'none', 'results': [], 'count': 0}

                # Save if it's new
                self.save_to_database(api_result)
                return {'source': 'api', 'results': [api_result], 'count': 1}
        
        return {'source': 'none', 'results': [], 'count': 0}
    
    def get_meaning(self, word):
        """Get meaning of a word"""
        row = self.df[self.df['sanskrit'] == word]
        if not row.empty:
            return str(row.iloc[0]['meaning']).split(';')[0]
        return word
    
    def auto_generate_sentences(self, count: int = 5) -> List[Dict]:
        """Auto-generate multiple sentences using dataset"""
        generated = []
        nouns = self.df[self.df['word_type'] == 'noun']['sanskrit'].tolist()
        verbs = self.df[self.df['word_type'] == 'verb']['sanskrit'].tolist()
        
        for i in range(count):
            if nouns and verbs:
                subject = random.choice(nouns)
                verb = random.choice(verbs)
                obj = random.choice(nouns) if random.random() > 0.3 else None
                
                if obj and obj != subject:
                    sentence = f"{subject} {obj} {verb}।"
                    pattern = "Subject Object Verb"
                    words = [subject, obj, verb]
                else:
                    sentence = f"{subject} {verb}।"
                    pattern = "Subject Verb"
                    words = [subject, verb]
                
                subject_meaning = self.get_meaning(subject)
                verb_meaning = self.get_meaning(verb).split()[0]
                obj_meaning = self.get_meaning(obj).split()[0] if obj else ""
                
                if obj:
                    translation = f"{subject_meaning} {obj_meaning} {verb_meaning}s."
                else:
                    translation = f"{subject_meaning} {verb_meaning}s."
                
                new_sentence = {
                    "id": len(self.sentences.get('sentences', [])) + i + 1,
                    "sanskrit": sentence,
                    "devanagari": sentence,
                    "translation": translation.capitalize(),
                    "words": words,
                    "pattern": pattern,
                    "difficulty": "auto-generated",
                    "tags": ["auto-generated"],
                    "created_at": datetime.now().isoformat()
                }
                generated.append(new_sentence)
        
        self.sentences.setdefault('sentences', []).extend(generated)
        self.save_sentences()
        return generated
    
    def get_random_sentence(self) -> Optional[Dict]:
        """Get random sentence from dataset"""
        if self.sentences.get('sentences'):
            return random.choice(self.sentences['sentences'])
        return None
    
    def get_database_stats(self) -> Dict:
        """Get database statistics"""
        return {
            'total_words': len(self.df),
            'database_words': len(self.df[self.df.get('source', '') == 'database']),
            'api_words': len(self.df[self.df.get('source', '').str.contains('api', na=False)]) if 'source' in self.df.columns else 0,
            'nouns': len(self.df[self.df['word_type'] == 'noun']) if 'word_type' in self.df.columns else 0,
            'verbs': len(self.df[self.df['word_type'] == 'verb']) if 'word_type' in self.df.columns else 0,
            'total_sentences': len(self.sentences.get('sentences', [])),
            'api_calls_today': self.api_calls_today
        }