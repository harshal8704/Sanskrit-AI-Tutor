from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import os
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
    if level:
        return [l for l in learning_engine.lessons if l.get('level') == level]
    return learning_engine.lessons

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
    """Get pronouns list"""
    return db.get_pronouns()

@app.get("/api/lessons/verbs")
def get_verbs():
    """Get verbs list"""
    return db.get_verbs()

@app.get("/api/lessons/nouns")
def get_nouns():
    """Get nouns list for genders lesson"""
    return db.get_nouns()

@app.get("/api/lessons/family")
def get_family():
    """Get family relationship words"""
    return db.get_family()

@app.get("/api/lessons/questions")
def get_question_words():
    """Get question words (prashna padas)"""
    return db.get_question_words()

@app.get("/api/lessons/time")
def get_time_and_days():
    """Get time and days vocabulary"""
    return db.get_time_and_days()

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

# ─── Snake & Ladder Translation Game ──────────────────────────
@app.get("/game/start")
def game_start():
    """Initialize a new Snake & Ladder game session."""
    return start_new_game()

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

if __name__ == "__main__":
    import uvicorn
    import os
    
    # Allow overriding the port via .env file, mapping it gracefully for user execution.
    port_str = os.getenv("PORT", "8005")
    port = int(port_str) if port_str.isdigit() else 8005
    
    try:
        uvicorn.run(app, host="0.0.0.0", port=port)
    except OSError as e:
        if "10048" in str(e) or "EADDRINUSE" in str(e):
            print(f"\n[PORT CONFLICT] The backend server is ALREADY RUNNING on port {port}.")
            print("You don't need to run 'python main.py' manually if it's already running in your other terminal.")
            print(f"To change the port, set PORT=8006 in your .env file.\n")
        else:
            raise
