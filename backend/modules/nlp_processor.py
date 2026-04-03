"""
NLP processor for Sanskrit text analysis
Uses rule-based and pre-trained models for demo
"""

import re
import random
import os
import requests
import json
from typing import Dict, List, Any
from dotenv import load_dotenv

# Load environment variables explicitly from current directory
env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path)

# Handle NLTK import gracefully
try:
    import nltk
    from nltk.tokenize import word_tokenize
    NLTK_AVAILABLE = True
    
    # Download required NLTK data if not already present
    try:
        nltk.data.find('tokenizers/punkt')
    except LookupError:
        print("Downloading NLTK punkt tokenizer...")
        nltk.download('punkt', quiet=True)
        
except ImportError:
    NLTK_AVAILABLE = False
    print("NLTK not installed. Using basic tokenization.")

class SanskritNLP:
    def __init__(self):
        # Mock Sanskrit vocabulary database
        # Mock Sanskrit vocabulary database
        self.vocabulary = {
            "रामः": {"pos": "noun", "gender": "masculine", "case": "nominative", "number": "singular", "meaning": "Rama"},
            "वनम्": {"pos": "noun", "gender": "neuter", "case": "accusative", "number": "singular", "meaning": "forest"},
            "गच्छति": {"pos": "verb", "tense": "present", "person": "third", "number": "singular", "meaning": "goes"},
            "गच्छामि": {"pos": "verb", "tense": "present", "person": "first", "number": "singular", "meaning": "I go"},
            "सीता": {"pos": "noun", "gender": "feminine", "case": "nominative", "number": "singular", "meaning": "Sita"},
            "अस्ति": {"pos": "verb", "tense": "present", "person": "third", "number": "singular", "meaning": "is"},
            "सुतः": {"pos": "noun", "gender": "masculine", "case": "nominative", "number": "singular", "meaning": "son"},
            "पुस्तकम्": {"pos": "noun", "gender": "neuter", "case": "nominative", "number": "singular", "meaning": "book"},
            "पठति": {"pos": "verb", "tense": "present", "person": "third", "number": "singular", "meaning": "reads"},
            "खादति": {"pos": "verb", "tense": "present", "person": "third", "number": "singular", "meaning": "eats"},
            "फलम्": {"pos": "noun", "gender": "neuter", "case": "nominative", "number": "singular", "meaning": "fruit"},
            "बालकः": {"pos": "noun", "gender": "masculine", "case": "nominative", "number": "singular", "meaning": "boy"},
            "अहं": {"pos": "pronoun", "case": "nominative", "number": "singular", "meaning": "I"},
            "अहम्": {"pos": "pronoun", "case": "nominative", "number": "singular", "meaning": "I"},
            "विद्यालय": {"pos": "noun", "gender": "masculine", "case": "base", "number": "singular", "meaning": "school"},
            "विद्यालयम्": {"pos": "noun", "gender": "masculine", "case": "accusative", "number": "singular", "meaning": "school (to)"},
            "विद्यालयं": {"pos": "noun", "gender": "masculine", "case": "accusative", "number": "singular", "meaning": "school (to)"},
        }
        
        # Grammar rules (simplified for demo)
        self.grammar_rules = [
            {"rule": "Subject-verb agreement", "pattern": r".*ः.*ति$", "description": "Nominative noun should agree with verb"},
            {"rule": "Case endings", "pattern": r".*म्$", "description": "Accusative case ending for objects"},
        ]
        
        # AI Configuration - Support both xAI (Grok) and Groq (gsk_...)
        self.api_key = os.getenv("XAI_API_KEY")
        self.base_url = os.getenv("BASE_URL")
        self.ai_provider: str = "Local"
        self.ai_model: str = "None"
        
        if self.api_key and isinstance(self.api_key, str):
            api_key_str: str = self.api_key
            if api_key_str.startswith("gsk_"):
                # It's a Groq key
                self.ai_provider = "Groq"
                self.base_url = "https://api.groq.com/openai/v1" # Force Groq URL
                self.ai_model = "llama-3.3-70b-versatile"
                print(f"SanskritNLP: Detected Groq API Key. Setting provider to {self.ai_provider}...")
            else:
                # Assume it's an xAI (Grok) key
                self.ai_provider = "Grok"
                self.base_url = self.base_url or "https://api.x.ai/v1"
                self.ai_model = "grok-beta"
                print(f"SanskritNLP: Detected {self.ai_provider} API Key.")
            
            # Safe slice for printing
            key_display = api_key_str[:8] if len(api_key_str) >= 8 else api_key_str
            print(f"SanskritNLP: AI Engine initialized with key starting with {key_display}...")
        else:
            print("SanskritNLP: AI Engine key NOT found. Check your .env file.")
    
    def tokenize(self, text: str) -> List[str]:
        """Tokenize Sanskrit text"""
        # Simple tokenization by splitting on spaces and punctuation
        if NLTK_AVAILABLE:
            try:
                # Basic cleanup for common punctuations often used as sentence ends
                clean_text = text.replace('|', '।').replace('.', '।')
                return word_tokenize(clean_text)
            except:
                pass
        
        # Fallback tokenization
        words = re.findall(r'[\u0900-\u097F]+|[.,!?;।|]', text)
        return [w for w in words if w.strip()]
    
    def analyze_text(self, text: str, mode: str = "Basic", use_ai: bool = False) -> Dict[str, Any]:
        """Analyze Sanskrit text for grammar and syntax"""
        
        # If AI mode is requested and we have a key
        if use_ai and self.api_key:
            return self.analyze_with_grok(text)

        # Normalize common markers before tokenizing
        normalized_text = text.replace('|', '।').replace('.', '।')
        words = self.tokenize(normalized_text)
        sanskrit_words = [w for w in words if re.match(r'[\u0900-\u097F]+', w)]
        
        # Breakdown with robust lookup
        breakdown = []
        for word in sanskrit_words:
            # Clean word for lookup (remove trailing punctuation)
            clean_word = re.sub(r'[.,!?;।|]$', '', word).strip()
            
            if clean_word in self.vocabulary:
                breakdown.append({
                    "word": word,
                    "pos": self.vocabulary[clean_word]["pos"],
                    "meaning": self.vocabulary[clean_word]["meaning"],
                    "analysis": self.vocabulary[clean_word]
                })
            else:
                # Try one more more time with common variations (e.g. anusvara vs ma-kara)
                alt_word = clean_word
                if clean_word.endswith('ं'):
                    alt_word = clean_word[:-1] + 'म्'
                elif clean_word.endswith('म्'):
                    alt_word = clean_word[:-1] + 'ं'
                
                if alt_word in self.vocabulary:
                    breakdown.append({
                        "word": word,
                        "pos": self.vocabulary[alt_word]["pos"],
                        "meaning": self.vocabulary[alt_word]["meaning"],
                        "analysis": self.vocabulary[alt_word]
                    })
                else:
                    breakdown.append({
                        "word": word,
                        "pos": "unknown",
                        "meaning": "unknown",
                        "analysis": {"note": "Word not in local dictionary"}
                    })
        
        # Generate issues
        issues = []
        if len(sanskrit_words) < 1:
             return {"error": "Please enter some text to analyze"}
        
        # Punctuation check: Sanskrit sentences should end with Purna Virama (।)
        if not text.strip().endswith('।') and not text.strip().endswith('|') and not text.strip().endswith('.'):
            issues.append("Sentence must end with a Purna Virama (।)")
        
        # Check specific grammar known to the lexicographer
        has_aham = any(w in ["अहं", "अहम्"] for w in sanskrit_words)
        has_gachhami = any(w == "गच्छामि" for w in sanskrit_words)
        
        if has_aham and has_gachhami:
            target = next((w for w in sanskrit_words if w == "विद्यालय"), None)
            if target:
                issues.append(f"Destination '{target}' should be in Accusative Case (Dvitiya Vibhakti)")
        
        # Calculate score
        score = max(0, 100 - len(issues) * 15)
        
        # Generate translation (mock)
        translation = self.mock_translate(normalized_text)
        
        if score < 100:
            # Smart mock correction for common student mistakes without altering standard structure
            corrected_sentence = text
            if "विद्यालय" in corrected_sentence and has_aham and has_gachhami and "विद्यालयं" not in corrected_sentence and "विद्यालयम्" not in corrected_sentence:
                corrected_sentence = corrected_sentence.replace("विद्यालय", "विद्यालयं")
            
                # basic fallback for random nouns
                for w in sanskrit_words:
                    if self.vocabulary.get(w, {}).get("pos") == "noun" and not w.endswith("ः") and not w.endswith("म्") and not w.endswith("ं"):
                        # cautious replace only if exact match word boundaries
                        corrected_sentence = re.sub(fr'\b{w}\b', w + "ः", corrected_sentence)

                correction_summary = "Corrected sentence structure and morphological markers."
            else:
                corrected_sentence = text
                correction_summary = "No errors found."

            # Final cleanup for punctuation: Ensure sentence ends with Purna Virama (।)
        corrected_sentence = corrected_sentence.strip()
        if corrected_sentence.endswith('.'):
            corrected_sentence = corrected_sentence[:-1] + "।"
        elif not corrected_sentence.endswith('।') and not corrected_sentence.endswith('|'):
            corrected_sentence += " ।"
        
        return {
            "score": score,
            "issues": issues,
            "corrected_sentence": corrected_sentence,
            "correction_summary": correction_summary,
            "breakdown": breakdown,
            "word_count": len(sanskrit_words),
            "translation": translation,
            "analysis_mode": mode,
            "ai_verified": False
        }

    def analyze_with_grok(self, text: str) -> Dict[str, Any]:
        """Use xAI's Grok API for professional morphological and syntactic analysis"""
        print(f"SanskritNLP: Starting AI Analysis for: {text} using {self.ai_provider}")
        try:
            prompt = f"""
            Task: You are an expert Sanskrit grammarian and Pāṇini scholar. Analyze the following Sanskrit sentence: "{text}"

            Instructions:
            1. Separate the sentence into individual Sanskrit words (tokens).
            2. For each word, provide morphological analysis (Vibhakti, Gender, Number, Tense, Person, Root).
            3. CRITICAL: Check for missing case endings (e.g., "विद्यालय" when it should be "विद्यालयं" for objects) and subject-verb agreement (e.g., "छात्राः पठति" to "छात्राः पठन्ति"). 
               - Purna Virama (।): Every Sanskrit sentence MUST end with '।'. If it is missing, or if they used a period (.), add "Missing or incorrect Purna Virama (।)" to the 'issues' list.
            4. Provide an overall grammar score (0-100). Prioritize morphological and syntactic correctness.
            5. EXTREMELY CRITICAL FOR "corrected_sentence": 
               - You MUST NOT add any new words.
               - You MUST NOT remove any user words.
               - ONLY fix case endings (vibhakti) and verb endings (lakāra/puruṣa/vacana).
               - Ensure the sentence ends with '।'. If the user used '.' or nothing, replace/add '।'.

               Examples of EXACT corrections:
               User: "अहं विद्यालय गच्छामि" -> Correct: "अहं विद्यालयं गच्छामि" (ONLY adding Anusvara)
               User: "छात्राः पुस्तकम् पठति" -> Correct: "छात्राः पुस्तकम् पठन्ति" (ONLY fixing verb number to match plural subject)
               BAD Correction (DO NOT DO THIS): "छात्राः पुस्तकम् पठति" -> "छात्राः पुस्तकं पठितुम् इच्छन्ति" (Added new words! Forbidden!)

            6. "correction_summary" must explain the specific grammatical rule (e.g., "Karka-Siddhanta: Destination requires Dvitiya Vibhakti").

            Output Format: STRICT JSON object with these fields:
            {{
                "score": int,
                "issues": ["list of strings detailing specific grammatical errors"],
                "corrected_sentence": "Properly corrected version in Devanagari",
                "correction_summary": "Linguistic reason for changes (e.g., Why 'विद्यालय' became 'विद्यालयं')",
                "breakdown": [
                    {{
                        "word": "original",
                        "pos": "POS Tag",
                        "meaning": "English",
                        "analysis": {{ "root": "...", "vibhakti": "...", "vachana": "...", "linga": "...", "details": "..." }}
                    }}
                ],
                "translation": "Full English translation"
            }}
            """

            headers = {
                "Authorization": f"Bearer {self.api_key}",
                "Content-Type": "application/json"
            }

            payload = {
                "model": self.ai_model,
                "messages": [
                    {"role": "system", "content": "You are an expert Sanskrit grammarian. Pay close attention to morphology, syntax, and punctuation. Every complete Sanskrit sentence must end with a Purna Virama (।)."},
                    {"role": "user", "content": prompt}
                ],
                "response_format": {"type": "json_object"},
                "temperature": 0.1
            }

            response = requests.post(f"{self.base_url}/chat/completions", headers=headers, json=payload, timeout=30)
            
            if response.status_code != 200:
                print(f"XAI API ERROR: {response.status_code} - {response.text}")
                return self.analyze_text(text, mode=f"API Error {response.status_code}", use_ai=False)
            
            result = response.json()
            analysis_text = result['choices'][0]['message']['content']
            
            # Robust JSON extraction (in case AI wraps it in markdown blocks)
            json_match = re.search(r'\{.*\}', analysis_text, re.DOTALL)
            if json_match:
                analysis_json = json.loads(json_match.group(0))
            else:
                analysis_json = json.loads(analysis_text)
            
            analysis_json["analysis_mode"] = f"{self.ai_provider} AI Engine"
            analysis_json["ai_verified"] = True

            # Final cleanup: Ensure corrected_sentence properly ends with Purna Virama (।)
            if "corrected_sentence" in analysis_json:
                corrected = analysis_json["corrected_sentence"].strip()
                if corrected.endswith('.'):
                    corrected = corrected[:-1] + "।"
                elif not corrected.endswith('।') and not corrected.endswith('|'):
                    corrected += " ।"
                analysis_json["corrected_sentence"] = corrected
            
            # Recalculate word count for AI results
            words = self.tokenize(text)
            s_words = [w for w in words if re.match(r'[\u0900-\u097F]+', w)]
            analysis_json["word_count"] = len(s_words)
            
            print(f"SanskritNLP: Successfully analyzed with Grok AI")
            return analysis_json

        except Exception as e:
            print(f"CRITICAL Grok API Error: {str(e)}")
            import traceback
            traceback.print_exc()
            # Fallback to local analysis if AI fails
            return self.analyze_text(text, mode="AI Fallback", use_ai=False)
    
    def mock_translate(self, text: str) -> str:
        """Mock translation for demo"""
        translations = {
            "रामः वनं गच्छति।": "Rama goes to the forest.",
            "सीता अस्ति।": "Sita is.",
            "सुतः पुस्तकं पठति।": "The son reads a book.",
            "बालकः फलं खादति।": "The boy eats fruit.",
        }
        
        if text in translations:
            return translations[text]
        
        # Generic translation
        words = text.split()
        if words:
            return f"Translation of '{words[0]}...' would appear here"
        
        return "Translation unavailable"
    
    def check_grammar(self, text: str) -> List[Dict]:
        """Check grammar against rules"""
        issues = []
        
        for rule in self.grammar_rules:
            if not re.search(rule["pattern"], text.replace(" ", "")):
                issues.append({
                    "rule": rule["rule"],
                    "description": rule["description"],
                    "suggestion": f"Check {rule['rule'].lower()}"
                })
        
        return issues
    
    def get_word_details(self, word: str) -> Dict:
        """Get detailed analysis of a Sanskrit word"""
        if word in self.vocabulary:
            return self.vocabulary[word]
        
        # Generate mock analysis for unknown words
        return {
            "pos": random.choice(["noun", "verb", "adjective"]),
            "meaning": "Meaning not in database",
            "note": "This word needs to be added to vocabulary"
        }