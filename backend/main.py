import sys

# Windows terminals can default to cp1252, while the application logs and
# Sanskrit learning data contain Unicode characters. Configure stdout before
# importing modules that emit startup messages.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import os
import json
from pydantic import BaseModel

# Import existing modules
from modules.database import MockDB
from modules.learning_engine import AdaptiveLearning
from modules.nlp_processor import SanskritNLP
from modules.auth import Authenticator
from modules.translator import SanskritTranslator
from modules.snake_ladder import start_new_game, process_turn
from modules.odd_one_out import get_random_question, check_answer

app = FastAPI(title="SanskritAI API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directory for data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Initialize modules
db = MockDB(data_dir=DATA_DIR)
learning_engine = AdaptiveLearning(lessons_file=os.path.join(DATA_DIR, 'lessons.json'))
nlp = SanskritNLP()
auth = Authenticator(users_file=os.path.join(DATA_DIR, 'users.json'))
translator = SanskritTranslator(
    csv_path=os.path.join(DATA_DIR, 'sanskrit_words.csv'),
    sentences_path=os.path.join(DATA_DIR, 'sanskrit_sentences.json')
)

# Pydantic models for request/response
class LoginRequest(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    role: str = "student"

class TranslateRequest(BaseModel):
    text: str
    direction: str = "en_to_sa"  # "en_to_sa" or "sa_to_en"
    use_api: bool = True

class GrammarRequest(BaseModel):
    text: str
    use_ai: bool = False

class GameTurnRequest(BaseModel):
    current_position: int = 0
    asked_word: str
    user_answer: str

class OddAnswerRequest(BaseModel):
    question_data: Dict
    user_choice: int  # 1-based index

# Endpoints
@app.get("/")
def read_root():
    return {"message": "SanskritAI API is running", "status": "online"}

@app.post("/auth/login")
def login(req: LoginRequest):
    user = auth.login(req.username, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return user

@app.post("/auth/signup")
def signup(req: SignupRequest):
    success = auth.signup(req.username, req.password, req.role)
    if not success:
        raise HTTPException(status_code=400, detail="Username already exists")
    return {"message": "Account created successfully"}

@app.get("/lessons")
def get_lessons(level: Optional[str] = None):
    lessons = db.load_all_lessons()
    if level:
        return {"success": True, "data": [l for l in lessons if l.get('level') == level], "count": len(lessons)}
    return {"success": True, "data": lessons, "count": len(lessons)}

@app.get("/lessons/{lesson_id}")
def get_lesson(lesson_id: int):
    lesson = next((l for l in learning_engine.lessons if l.get('id') == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

@app.get("/api/lessons/greetings")
def get_greetings_lesson():
    data = db.get_greetings()
    return {"success": True, "data": data}

@app.get("/api/lessons/numbers")
def get_numbers_lesson():
    data = db.get_numbers()
    return {"success": True, "data": data}

@app.get("/api/lessons/self-intro")
def get_self_intro_lesson():
    data = db.get_self_intro()
    return {"success": True, "data": data}

@app.get("/api/lessons/pronouns")
def get_pronouns():
    return db.get_pronouns()

@app.get("/api/lessons/verbs")
def get_verbs():
    return db.get_verbs()

@app.get("/api/lessons/nouns")
def get_nouns():
    return db.get_nouns()

@app.get("/api/lessons/family")
def get_family():
    return db.get_family()

@app.get("/api/lessons/questions")
def get_question_words():
    return db.get_question_words()

@app.get("/api/lessons/time")
def get_time_and_days():
    return db.get_time_and_days()

@app.get("/api/daily-questions")
def get_daily_questions():
    with open(os.path.join(DATA_DIR, 'dailyQuestions.json'), encoding='utf-8') as questions_file:
        return json.load(questions_file)

@app.get("/progress/{username}")
def get_progress(username: str):
    return db.get_user_progress(username)

@app.get("/activities/{username}")
def get_activities(username: str):
    return db.get_recent_activities(username)

@app.post("/translate")
def translate_text(req: TranslateRequest):
    try:
        if req.direction == "en_to_sa":
            result = translator.English_to_sanskrit(req.text, req.use_api)
        else:
            result = translator.sanskrit_to_English(req.text, req.use_api)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/grammar/check")
def check_grammar(req: GrammarRequest):
    analysis = nlp.analyze_text(req.text, use_ai=req.use_ai)
    return analysis

@app.get("/dashboard/stats/{username}")
def get_dashboard_stats(username: str):
    progress = db.get_user_progress(username)
    activities = db.get_recent_activities(username)
    stats = translator.get_database_stats()
    
    return {
        "words_learned": len(activities),
        "lessons_completed": progress.get('completed', 0),
        "current_level": progress.get('level', 'beginner'),
        "points": progress.get('points', 0),
        "db_stats": stats
    }

@app.post("/progress/{username}/complete")
def mark_lesson_complete(username: str, payload: Dict[str, Any] = Body(...)):
    if username not in auth.users:
        raise HTTPException(status_code=404, detail="User not found")

    lesson_id = payload.get("lesson_id")
    if lesson_id is None:
        raise HTTPException(status_code=400, detail="lesson_id is required")

    user = auth.users[username]
    completed = int(user.get("completed", 0))
    user["completed"] = completed + 1
    user["level"] = user.get("level", "beginner")
    auth.save_users(auth.users)

    return {
        "success": True,
        "username": username,
        "lesson_id": lesson_id,
        "completed": user["completed"],
        "message": "Lesson marked as complete"
    }

# ─── Suggestions Endpoint (Local DB + Groq Fallback) ──────────────────────────
@app.get("/suggestions")
def get_suggestions(prefix: str, limit: int = 6):
    """
    Return Devanagari word suggestions using local DB + Groq API.
    """
    if not prefix or len(prefix) < 1:
        return {"suggestions": []}
    
    matches = []
    seen = set()
    
    # First, search local database in 'devanagari' column
    df = translator.df
    for _, row in df.iterrows():
        dev = str(row.get('devanagari', ''))
        if dev.startswith(prefix) and dev not in seen:
            seen.add(dev)
            matches.append({
                "word": dev,
                "meaning": str(row.get('english', '')),
                "sanskrit": str(row.get('sanskrit', ''))
            })
            if len(matches) >= limit:
                return {"suggestions": matches}
    
    # Also check 'sanskrit' transliterated column (e.g., "agniḥ" -> "अग्निः")
    if len(matches) < limit:
        for _, row in df.iterrows():
            san = str(row.get('sanskrit', ''))
            # Convert IAST/roman to Devanagari for matching? For now, direct compare
            if san.startswith(prefix) and san not in seen:
                seen.add(san)
                matches.append({
                    "word": san,
                    "meaning": str(row.get('english', '')),
                    "sanskrit": san
                })
                if len(matches) >= limit:
                    return {"suggestions": matches}
    
    # If not enough matches and Groq API key exists, call AI for suggestions
    if len(matches) < limit and translator.api_key:
        try:
            import requests
            import json
            import re
            remaining = limit - len(matches)
            prompt = f"""
            You are a Sanskrit lexicon. Given the Devanagari prefix "{prefix}", suggest {remaining} common Sanskrit words (in Devanagari script) that start with this prefix.
            Return only a JSON array of objects with fields: "word" (Devanagari), "meaning" (English), "sanskrit" (transliterated IAST).
            Example: [{{"word": "नमस्ते", "meaning": "hello", "sanskrit": "namaste"}}]
            """
            headers = {"Authorization": f"Bearer {translator.api_key}", "Content-Type": "application/json"}
            payload = {
                "model": translator.ai_model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3,
                "response_format": {"type": "json_object"}
            }
            response = requests.post(f"{translator.base_url}/chat/completions", headers=headers, json=payload, timeout=10)
            if response.status_code == 200:
                result = response.json()
                content = result['choices'][0]['message']['content']
                json_match = re.search(r'\[.*\]', content, re.DOTALL)
                if json_match:
                    ai_suggestions = json.loads(json_match.group(0))
                    for sugg in ai_suggestions[:remaining]:
                        word = sugg.get("word", "")
                        if word and word not in seen:
                            matches.append({
                                "word": word,
                                "meaning": sugg.get("meaning", ""),
                                "sanskrit": sugg.get("sanskrit", "")
                            })
                            if len(matches) >= limit:
                                break
        except Exception as e:
            print(f"Groq suggestion error: {e}")
    
    return {"suggestions": matches}

# ─── Snake & Ladder Translation Game ──────────────────────────
@app.get("/game/start")
def game_start():
    """Initialize a new Snake & Ladder game session."""
    return start_new_game()

@app.get("/api/lessons/all")
def get_all_lessons():
    """Get all 35 lessons with their metadata"""
    try:
        lessons = db.load_all_lessons()
        return {"success": True, "data": lessons, "count": len(lessons)}
    except Exception as e:
        return {"success": False, "message": str(e)}

@app.get("/api/lessons/{lesson_id}")
def get_lesson_by_id(lesson_id: str):
    """Get a specific lesson by its ID"""
    try:
        lessons = db.load_all_lessons()
        for lesson in lessons:
            if lesson.get('id') == lesson_id:
                return {"success": True, "data": lesson}
        return {"success": False, "message": "Lesson not found"}
    except Exception as e:
        return {"success": False, "message": str(e)}
    
@app.post("/game/turn")
def game_turn(req: GameTurnRequest):
    """Process one turn: validate the answer, move the player."""
    return process_turn(req.current_position, req.asked_word, req.user_answer)

# ─── Odd One Out Game ─────────────────────────────────────────
@app.get("/game/odd/question")
def odd_question():
    """Get a random Odd One Out question."""
    return get_random_question()

@app.post("/game/odd/answer")
def odd_answer(req: OddAnswerRequest):
    """Check the user's answer for Odd One Out."""
    return check_answer(req.question_data, req.user_choice)

# ─── Test API Key Endpoint ────────────────────────────────────
@app.get("/test-api")
def test_api():
    """Test if API key is loaded correctly"""
    api_key = os.getenv("XAI_API_KEY")
    base_url = os.getenv("BASE_URL")
    return {
        "has_api_key": bool(api_key),
        "key_preview": api_key[:10] + "..." if api_key and len(api_key) > 10 else None,
        "provider": "Groq" if api_key and api_key.startswith("gsk_") else "Grok" if api_key else "None",
        "base_url": base_url,
        "ai_available": bool(api_key)
    }

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Standardize on the documented backend port unless an override is explicitly set.
    port_str = os.getenv("PORT", "8000")
    port = int(port_str) if port_str.isdigit() else 8000
    
    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except OSError as e:
        if "10048" in str(e) or "EADDRINUSE" in str(e):
            print(f"\n[PORT CONFLICT] The backend server is ALREADY RUNNING on port {port}.")
            print("You don't need to run 'python main.py' manually if it's already running in your other terminal.")
            print(f"To change the port, set PORT=8006 in your .env file.\n")
        else:
            raise
