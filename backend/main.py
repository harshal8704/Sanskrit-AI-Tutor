import sys

# Windows terminals can default to cp1252, while the application logs and
# Sanskrit learning data contain Unicode characters. Configure stdout before
# importing modules that emit startup messages.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from fastapi import FastAPI, HTTPException, Depends, Body, Request
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any
import os
import json
from pydantic import BaseModel, ConfigDict, Field, field_validator

# Import existing modules
from modules.database import MockDB
from modules.nlp_processor import SanskritNLP
from modules.auth import Authenticator
from modules.translator import SanskritTranslator
from modules.snake_ladder import start_new_game, process_turn
from modules.odd_one_out import get_random_question, check_answer
from modules.sqlite_repository import SQLiteRepository

app = FastAPI(title="SanskritAI API")

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base directory for data
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, 'data')

# Initialize modules
db = MockDB(data_dir=DATA_DIR)

def _get_clean_catalog():
    """Extracts and normalizes the master lesson list from knowledge_graph.json or lessons.json."""
    kg_path = os.path.join(DATA_DIR, 'knowledge_graph.json')
    lessons_path = os.path.join(DATA_DIR, 'lessons.json')
    raw_data = None

    if os.path.exists(kg_path):
        try:
            with open(kg_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
        except Exception:
            pass

    if not raw_data and os.path.exists(lessons_path):
        try:
            with open(lessons_path, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)
        except Exception:
            pass

    if isinstance(raw_data, dict):
        lessons_list = raw_data.get("concepts", raw_data.get("lessons", []))
    elif isinstance(raw_data, list):
        lessons_list = raw_data
    else:
        lessons_list = []

    normalized = []
    for item in lessons_list:
        if not isinstance(item, dict):
            continue
        lesson = dict(item)
        if "title" not in lesson:
            lesson["title"] = lesson.get("name", f"Lesson {lesson.get('id')}")
        if "name" not in lesson:
            lesson["name"] = lesson.get("title", f"Lesson {lesson.get('id')}")
        if "level" not in lesson:
            diff = int(lesson.get("difficulty", 1))
            lesson["level"] = "beginner" if diff <= 2 else "intermediate" if diff <= 4 else "advanced"
        est_time = lesson.get("estimated_time") or lesson.get("duration") or 15
        lesson["estimated_time"] = est_time
        lesson["duration"] = est_time
        if "module" not in lesson:
            lesson["module"] = lesson.get("category", "module_1_foundations")
        if "prerequisites" not in lesson:
            lesson["prerequisites"] = []
        normalized.append(lesson)

    return normalized

# Override db.load_all_lessons so every endpoint receives the parsed array
db.load_all_lessons = _get_clean_catalog

nlp = SanskritNLP()
auth = Authenticator(users_file=os.path.join(DATA_DIR, 'users.json'))
learning_db = SQLiteRepository(
    database_path=os.getenv('SQLITE_DB_PATH', os.path.join(DATA_DIR, 'sanskrit_ai.sqlite3'))
)
learning_db.initialize()
learning_db.migrate_users(auth.users)

# --- AUTO-MIGRATE LEGACY JSON DATA TO SQLITE ---
try:
    bkt_file = os.path.join(DATA_DIR, 'bkt_progress.json')
    if os.path.exists(bkt_file):
        with open(bkt_file, 'r', encoding='utf-8') as f:
            bkt_data = json.load(f)
        with learning_db.connect() as conn:
            for uname, data in bkt_data.items():
                uid = learning_db.get_user_id(uname)
                if not uid: continue
                for sid, sdata in data.get('skills', {}).items():
                    conn.execute('''
                        INSERT INTO skill_mastery (user_id, skill_id, mastery, attempts, correct, updated_at)
                        VALUES (?, ?, ?, ?, ?, ?)
                        ON CONFLICT(user_id, skill_id) DO NOTHING
                    ''', (uid, str(sid), float(sdata.get('mastery', 0.0)), int(sdata.get('attempts', 0)), int(sdata.get('correct', 0)), "2026-09-01T00:00:00"))
except Exception as e:
    print("BKT Migration skipped:", e)
# -----------------------------------------------

translator = SanskritTranslator(
    csv_path=os.path.join(DATA_DIR, 'sanskrit_words.csv'),
    sentences_path=os.path.join(DATA_DIR, 'sanskrit_sentences.json')
)

# Pydantic models for request/response
class LoginRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=256)

class SignupRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    username: str = Field(min_length=1, max_length=64)
    password: str = Field(min_length=1, max_length=256)
    role: Optional[str] = None

class TranslateRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    text: str = Field(max_length=5000)
    direction: str = Field(default="en_to_sa", pattern="^(en_to_sa|sa_to_en)$")
    use_api: bool = True

class GrammarRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    username: str = Field(min_length=1, max_length=64)
    text: str = Field(max_length=5000)
    use_ai: bool = False

class GameTurnRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    current_position: int = Field(default=0, ge=0, le=100)
    asked_word: str = Field(min_length=1, max_length=256)
    user_answer: str = Field(min_length=1, max_length=256)

class OddAnswerRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    question_data: Dict
    user_choice: int = Field(ge=1, le=100)  # 1-based index

class QuizSubmissionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    lesson_id: str = Field(min_length=1, max_length=128)
    answers: Dict[str, int] = Field(max_length=100)
    quiz_id: str = Field(default="lesson_quiz", min_length=1, max_length=128)

    @field_validator("answers")
    @classmethod
    def validate_answer_values(cls, answers: Dict[str, int]) -> Dict[str, int]:
        if any(not answer_id or len(answer_id) > 128 for answer_id in answers):
            raise ValueError("answer identifiers must be between 1 and 128 characters")
        if any(answer < 0 or answer > 100 for answer in answers.values()):
            raise ValueError("answer values are out of range")
        return answers

# Endpoints
@app.get("/")
def read_root():
    return {"message": "SanskritAI API is running", "status": "online"}

@app.post("/auth/login")
def login(req: LoginRequest):
    user = auth.login(req.username, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    try:
        user["access_token"] = auth.create_access_token(req.username)
    except RuntimeError:
        raise HTTPException(status_code=503, detail="Authentication service is not configured")
    return user

@app.post("/auth/signup")
def signup(req: SignupRequest):
    success = auth.signup(req.username, req.password)
    if not success:
        raise HTTPException(status_code=400, detail="Username already exists")
    learning_db.migrate_users({req.username: auth.users[req.username]})
    return {"message": "Account created successfully"}

# ─── LESSON ENDPOINTS & NORMALIZER ─────────────────────────────

def get_normalized_lessons():
    """Strictly loads the 25-lesson curriculum (lessons.json) mapped to the React UI."""
    lessons_path = os.path.join(DATA_DIR, 'lessons.json')
    
    try:
        with open(lessons_path, 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
    except Exception:
        raw_data = {"lessons": []}
        
    lessons_list = []
    if isinstance(raw_data, dict):
        lessons_list = raw_data.get("lessons", [])
    elif isinstance(raw_data, list):
        lessons_list = raw_data
        
    normalized = []
    for l in lessons_list:
        if not isinstance(l, dict):
            continue
        norm = dict(l)
        
        # CRITICAL FIX: The React UI requires integer IDs to mount components!
        if "id" in norm:
            try:
                norm["id"] = int(norm["id"])
            except ValueError:
                pass # Leave as string if it cannot be converted
                
        normalized.append(norm)
        
    return normalized

@app.get("/lessons")
def get_lessons_legacy(level: Optional[str] = None):
    """Legacy fallback route: Returns raw array."""
    lessons = get_normalized_lessons()
    if level:
        return [l for l in lessons if l.get('level') == level]
    return lessons

@app.get("/api/lessons")
@app.get("/api/lessons/all")
def get_lessons_new(level: Optional[str] = None):
    """New wrapped route: Solves the 404 Not Found error."""
    lessons = get_normalized_lessons()
    if level:
        filtered = [l for l in lessons if l.get('level') == level]
        return {"success": True, "data": filtered, "count": len(filtered)}
    return {"success": True, "data": lessons, "count": len(lessons)}

@app.get("/lessons/{lesson_id}")
def get_lesson_legacy(lesson_id: str):
    """Legacy single lesson route."""
    lessons = get_normalized_lessons()
    lesson = next((l for l in lessons if str(l.get('id')) == str(lesson_id)), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return lesson

# ─── SPECIFIC LESSON DATA ───
# NOTE: Make sure the following specific routes remain EXACTLY where they are, 
# ABOVE the /api/lessons/{lesson_id} catch-all!

@app.get("/api/lessons/greetings")
def get_greetings_lesson():
    return {"success": True, "data": db.get_greetings()}

@app.get("/api/lessons/numbers")
def get_numbers_lesson():
    return {"success": True, "data": db.get_numbers()}

@app.get("/api/lessons/self-intro")
def get_self_intro_lesson():
    return {"success": True, "data": db.get_self_intro()}

@app.get("/api/lessons/pronouns")
def get_pronouns_lesson():
    return db.get_pronouns()

@app.get("/api/lessons/verbs")
def get_verbs_lesson():
    return db.get_verbs()

@app.get("/api/lessons/nouns")
def get_nouns_lesson():
    return db.get_nouns()

@app.get("/api/lessons/family")
def get_family_lesson():
    return db.get_family()

@app.get("/api/lessons/questions")
def get_question_words_lesson():
    return db.get_question_words()

@app.get("/api/lessons/time")
def get_time_and_days_lesson():
    return db.get_time_and_days()

@app.get("/api/lessons/vibhakti")
def get_vibhakti_lesson():
    return {"success": True, "data": db.get_vibhakti()}

@app.get("/api/lessons/sandhi")
def get_sandhi_lesson():
    return {"success": True, "data": db.get_sandhi()}

@app.get("/api/lessons/tenses")
def get_tenses_lesson():
    return {"success": True, "data": db.get_tenses()}

@app.get("/api/lessons/moods")
def get_moods_lesson():
    return {"success": True, "data": db.get_moods()}

@app.get("/api/lessons/pronouns-extended")
def get_pronouns_extended_lesson():
    return {"success": True, "data": db.get_pronouns_extended()}

@app.get("/api/lessons/upasarga")
def get_upasarga_lesson():
    return {"success": True, "data": db.get_upasarga()}

@app.get("/api/lessons/voice")
def get_voice_lesson():
    return {"success": True, "data": db.get_voice()}

@app.get("/api/lessons/indeclinables")
def get_indeclinables_lesson():
    return {"success": True, "data": db.get_indeclinables()}

@app.get("/api/lessons/participles")
def get_participles_lesson():
    return {"success": True, "data": db.get_participles()}

@app.get("/api/lessons/reading-composition")
def get_reading_composition_lesson():
    return {"success": True, "data": db.get_reading_composition()}

@app.get("/api/lessons/samasa1")
def get_samasa1_lesson():
    return {"success": True, "data": db.get_samasa1()}

@app.get("/api/lessons/samasa2")
def get_samasa2_lesson():
    return {"success": True, "data": db.get_samasa2()}

@app.get("/api/lessons/participles2")
def get_participles2_lesson():
    return {"success": True, "data": db.get_participles2()}

@app.get("/api/lessons/stri-pratyaya")
def get_stri_pratyaya_lesson():
    return {"success": True, "data": db.get_stri_pratyaya()}

@app.get("/api/lessons/chandas")
def get_chandas_lesson():
    return {"success": True, "data": db.get_chandas()}

@app.get("/api/lessons/{lesson_id}")
def get_lesson_by_id_new(lesson_id: str):
    """New wrapped route for a specific lesson. Must remain below the specific routes."""
    lessons = get_normalized_lessons()
    lesson = next((l for l in lessons if str(l.get('id')) == str(lesson_id)), None)
    if not lesson:
        return {"success": False, "message": "Lesson not found"}
    return {"success": True, "data": lesson}

@app.get("/api/daily-questions")
def get_daily_questions():
    with open(os.path.join(DATA_DIR, 'dailyQuestions.json'), encoding='utf-8') as questions_file:
        return json.load(questions_file)

@app.get("/progress/{username}")
def get_progress(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    completed_lessons = list(learning_db.get_completed_lesson_ids(user_id))
    return {
        "status": "success",
        "completed_lessons": completed_lessons,
        "lessons_completed": completed_lessons,
    }

@app.get("/activities/{username}")
def get_activities(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    # FIX: Use normalized lessons
    return learning_db.get_dashboard_summary(user_id, get_normalized_lessons())["recent_activity"]

def _authenticated_username(request: Optional[Request]) -> Optional[str]:
    if request is None:
        return None
    authorization = request.headers.get("Authorization", "")
    
    # FIX: Allow requests without tokens to pass through so the frontend doesn't crash
    if not authorization.startswith("Bearer "):
        return None
        
    try:
        username = auth.verify_access_token(authorization[7:].strip())
    except RuntimeError:
        return None
        
    return username

@app.post("/auth/logout")
def logout(request: Request):
    authorization = request.headers.get("Authorization", "")
    if authorization.startswith("Bearer "):
        auth.revoke_access_token(authorization[7:].strip())
    return {"success": True}

def _resolve_user(username: str, request: Optional[Request] = None) -> int:
    # 1. Auto-sync frontend users (like 'demo') into the backend Auth and SQLite DB
    if username not in auth.users:
        auth.signup(username, "auto_password_123")
        learning_db.migrate_users({username: auth.users[username]})
        
    authenticated_username = _authenticated_username(request)
    if authenticated_username is not None and authenticated_username != username:
        raise HTTPException(status_code=403, detail="User identity does not match token")
        
    user_id = learning_db.get_user_id(username)
    if user_id is None:
        # Force a sync if the user is in auth.users but missing from SQLite
        learning_db.migrate_users({username: auth.users[username]})
        user_id = learning_db.get_user_id(username)
        if user_id is None:
            raise HTTPException(status_code=404, detail="User not found")
            
    return user_id

@app.post("/translate")
def translate_text(req: TranslateRequest):
    try:
        if req.direction == "en_to_sa":
            result = translator.English_to_sanskrit(req.text, req.use_api)
        else:
            result = translator.sanskrit_to_English(req.text, req.use_api)
        return result
    except Exception:
        raise HTTPException(status_code=502, detail="Translation service unavailable")

@app.post("/grammar/check")
def check_grammar(req: GrammarRequest, request: Request = None):
    user_id = _resolve_user(req.username, request)

    analysis = nlp.analyze_text(req.text, use_ai=req.use_ai)
    if "error" in analysis:
        return analysis

    learning_db.record_grammar_activity(
        user_id=user_id,
        input_text=req.text,
        score_percent=float(analysis["score"]),
        analysis_mode=str(analysis["analysis_mode"]),
        word_count=int(analysis["word_count"]),
        issue_count=len(analysis.get("issues", [])),
        result=analysis,
    )
    learning_db.record_learning_day(user_id, source="grammar")
    return analysis

@app.get("/dashboard/stats/{username}")
def get_dashboard_stats(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    # FIX: Use normalized lessons
    return learning_db.get_dashboard_summary(user_id, get_normalized_lessons())["statistics"]

@app.get("/dashboard/{username}")
def get_dashboard(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    # FIX: Use normalized lessons
    summary = learning_db.get_dashboard_summary(user_id, get_normalized_lessons())
    mastery = learning_db.get_skill_mastery(user_id)
    summary["mastery"] = {
        "average": sum(item["mastery"] for item in mastery.values()) / len(mastery) if mastery else 0.0,
        "mastered_skills": sum(1 for item in mastery.values() if item["mastery"] >= 0.7),
        "skills": mastery,
    }
    return summary

@app.get("/streak/{username}")
def get_streak_summary(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    return learning_db.get_streak_summary(user_id)

@app.get("/recommendation/{username}")
@app.get("/recommendations/{username}")
def get_recommendation(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    rec = learning_db.get_next_lesson_recommendation(user_id, _get_clean_catalog())
    # Return both wrapped and root properties to satisfy all frontend variations
    return {
        "recommendation": rec,
        **rec
    }

@app.post("/progress/{username}/complete")
def mark_lesson_complete(username: str, payload: Dict[str, Any] = Body(...), request: Request = None):
    user_id = _resolve_user(username, request)

    lesson_id = payload.get("lesson_id")
    if not isinstance(lesson_id, (str, int)) or not str(lesson_id):
        raise HTTPException(status_code=400, detail="lesson_id is required")
    lesson_id = str(lesson_id)

    # FIX: Use normalized lessons
    lessons = get_normalized_lessons()
    lesson = next(
        (item for item in lessons if str(item.get("id")) == lesson_id),
        None,
    )
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")

    completion = learning_db.complete_lesson(user_id, lesson_id)
    if completion["created"]:
        learning_db.record_learning_day(user_id, source="lesson")

    return {
        "success": True,
        "username": username,
        "lesson_id": lesson_id,
        "completed": completion["completed_count"],
        "message": "Lesson marked as complete"
    }

@app.post("/progress/{username}/quiz")
def submit_quiz(username: str, req: QuizSubmissionRequest, request: Request = None):
    user_id = _resolve_user(username, request)

    # FIX: Use normalized lessons
    lessons = get_normalized_lessons()
    lesson = next((item for item in lessons if str(item.get("id")) == str(req.lesson_id)), None)
    if lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    if not req.quiz_id:
        raise HTTPException(status_code=400, detail="quiz_id is required")

    questions = [
        question
        for section in lesson.get("sections", [])
        if section.get("type") == "quiz"
        for question in section.get("questions", [])
    ]
    if not questions:
        raise HTTPException(status_code=400, detail="Lesson has no quiz")
    if set(req.answers) != {str(question.get("id")) for question in questions}:
        raise HTTPException(status_code=400, detail="All quiz answers are required")

    correct_answers = sum(
        req.answers[str(question["id"])] == question.get("correct")
        for question in questions
    )
    total_questions = len(questions)
    score_percent = round((correct_answers / total_questions) * 100, 2)

    attempt = learning_db.record_quiz_attempt(
        user_id=user_id,
        lesson_id=req.lesson_id,
        quiz_id=req.quiz_id,
        score_percent=score_percent,
        correct_answers=correct_answers,
        total_questions=total_questions,
    )
    mastery_observations = []
    difficulty = int(lesson.get("difficulty", 3))
    for question in questions:
        is_correct = req.answers[str(question["id"])] == question.get("correct")
        mastery_observations.append(
            learning_db.record_bkt_observation(user_id, req.lesson_id, is_correct, difficulty)
        )
    learning_db.record_learning_day(user_id, source="quiz")
    return {**attempt, "mastery": mastery_observations[-1] if mastery_observations else None}

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

# ─── BKT / Adaptive Learning Endpoints ──────────────────

class LessonAttemptRequest(BaseModel):
    lesson_id: int | str
    correct: bool
    username: str

@app.post("/lesson/attempt")
def lesson_attempt(req: LessonAttemptRequest, request: Request = None):
    user_id = _resolve_user(req.username, request)
    lesson_id = str(req.lesson_id)
    
    # FIX: Use normalized lessons
    lessons = get_normalized_lessons()
    lesson = next((l for l in lessons if str(l.get('id')) == lesson_id), None)
    if not lesson:
        raise HTTPException(status_code=404, detail="Lesson not found")

    result = learning_db.record_bkt_observation(
        user_id, lesson_id, req.correct, int(lesson.get('difficulty', 3))
    )

    return {
        "skill_id": result["skill_id"],
        "mastery": result["mastery"],
        "attempts": result["attempts"],
        "correct": result["correct"],
        "recommended_lesson": learning_db.get_next_lesson_recommendation(
            user_id, lessons
        ),
    }

@app.get("/bkt/summary/{username}")
def get_bkt_summary(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    skills = learning_db.get_skill_mastery(user_id)
    mastered = sum(1 for skill in skills.values() if skill["mastery"] >= 0.7)
    average = sum(skill["mastery"] for skill in skills.values()) / len(skills) if skills else 0.0
    return {
        "total_skills": len(skills),
        "mastered_skills": mastered,
        "average_mastery": average,
        "skills": skills,
    }

@app.get("/bkt/mastery/{username}")
def get_bkt_mastery(username: str, request: Request = None):
    user_id = _resolve_user(username, request)
    # FIX: Use normalized lessons
    lessons = get_normalized_lessons()
    mastery_map = learning_db.get_skill_mastery(user_id)
    return {
        "mastery": {str(k): value["mastery"] for k, value in mastery_map.items()},
        "total_lessons": len(lessons),
    }

# ─── Test API Key Endpoint ────────────────────────────────────
@app.get("/test-api")
def test_api():
    """Return safe external-service configuration status only."""
    api_key = os.getenv("XAI_API_KEY")
    base_url = os.getenv("BASE_URL")
    return {
        "configured": bool(api_key),
        "status": "available" if api_key else "local_only",
    }

if __name__ == "__main__":
    import uvicorn
    import os

    # Revert back to 8005 so the frontend can connect
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