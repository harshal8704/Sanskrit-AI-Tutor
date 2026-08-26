<<<<<<< HEAD
# SanskritAI - Modern Architecture

Intelligent Sanskrit Language Revival Through Adaptive Learning.
Migrated from Streamlit to a full-stack Next.js + FastAPI architecture.

## Folder Structure

- `/frontend`: Next.js app with TypeScript and React.
- `/backend`: FastAPI Python server with core logic modules.

## Getting Started

### Backend
1. `cd backend`
2. `pip install -r requirements.txt`
3. `python main.py`

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`

Navigate to `http://localhost:3000` to use the application.
Backend API documentation is available at `http://localhost:8000/docs`.
=======
# 🕉️ SanskritAI Tutor

> **Intelligent Sanskrit Language Learning Through Adaptive AI**
>
> A modern, gamified, and intelligent full-stack application designed to make learning the ancient Sanskrit language intuitive, engaging, and personalized. Migrated from a Streamlit proof-of-concept to a robust, responsive **Next.js + FastAPI** architecture.

---

## 🚀 Key Features

### 🧠 1. Adaptive Learning Engine
Interactive curriculum modules covering foundational grammar and vocabulary, adapted dynamically based on learner performance:
*   **Greetings & Self-Introduction** (शिष्टाचारः & स्वपरिचयः)
*   **Numbers & Time** (संख्याः & समयः)
*   **Nouns, Pronouns, & Verbs** (संज्ञा, सर्वनाम & क्रिया)
*   **Family & Questions** (परिवारः & प्रश्नशब्दाः)

### ✍️ 2. Virtual Devanagari Keyboard
*   A custom virtual keyboard interface supporting phonetic/Devanagari inputs directly in-browser.
*   Enables smooth typing without needing to configure system-level input method editors (IMEs).

### 🔮 3. NLP & Grammar Parser
*   Under the hood NLP processor offering morphological analysis, sandhi split suggestions, noun/verb declensions, and structural breakdown of Sanskrit words.

### 🗣️ 4. Hybrid Translation Engine
*   Translates bidirectional texts (English ↔ Sanskrit).
*   Combines a precise local dictionary mapping rules with a smart **Gemini LLM fallback** mechanism to handle complex phrases.

### 🎲 5. Gamified Learning Modules
*   **Sanskrit Snakes & Ladders (द्वन्द्व क्रीडा):** Move across the board by answering vocabulary translation questions correctly. Beware of the snakes!
*   **Odd One Out (विषमपद चयनम्):** Test your vocabulary retention by identifying semantically incongruous words.

### 📈 6. Progress & Streak Tracking
*   Interactive dashboard visualizing learning velocity, daily streaks, earned points, and overall curriculum completeness.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Next.js (App Router), TypeScript, Framer Motion, Lucide React, CSS Modules |
| **Backend** | Python, FastAPI, Pydantic, Uvicorn, SQLite/JSON Mock database |
| **AI / NLP** | Google Gemini Pro (via Gemini API), Hugging Face inference tokens |

---

## 📁 Repository Structure

```text
SanskritAI Tutor/
├── frontend/               # Next.js App Router (TypeScript)
│   ├── src/
│   │   ├── app/            # Next.js pages (dashboard, grammar, lessons, games)
│   │   ├── components/     # Reusable UI component libraries & interactive lessons
│   │   └── lib/            # Axios/Fetch API client bindings
│   ├── package.json
│   └── .env.local          # Frontend environment config
│
├── backend/                # FastAPI application
│   ├── modules/            # Core Python logic (nlp, translation, games, db)
│   ├── data/               # SQLite / JSON databases & vocabulary dictionaries
│   ├── main.py             # Server entry point and API routes
│   └── requirements.txt
│
└── .env.example            # Shared environment variables template
```

---

## ⚙️ Setup & Installation

### 1. Prerequisites
*   Node.js (v18.x or later)
*   Python (3.9 or later)
*   Optional: Gemini API Key / Hugging Face Token

### 2. Environment Configuration
Copy `.env.example` to the appropriate environments:

**Root / Backend (`backend/.env`):**
```env
# Application Settings
SECRET_KEY=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# AI APIs (Optional but recommended for full translator capability)
GOOGLE_API_KEY=your_gemini_api_key_here
HUGGINGFACE_TOKEN=your_huggingface_token_here
```

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_API_URL=http://localhost:8005
PORT=3000
```

---

### 3. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    # Windows
    python -m venv venv
    .\venv\Scripts\activate

    # macOS/Linux
    python3 -m venv venv
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run the server:
    ```bash
    python main.py
    ```
    *The server runs locally at `http://localhost:8005` by default.*

---

### 4. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install packages:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    *Access the application at `http://localhost:3000` in your web browser.*

---

## 📖 API Documentation

FastAPI automatically generates interactive, self-documenting API structures. Once your backend is running, you can explore, test, and view detail descriptions of all active endpoints:

*   **Swagger UI (Interactive Docs):** [http://localhost:8005/docs](http://localhost:8005/docs)
*   **Redocly (Alternative Visualizer):** [http://localhost:8005/redoc](http://localhost:8005/redoc)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request with any improvements to the grammar parsing engine, additions to the lesson curriculums, or enhancements to the interactive UI games.
>>>>>>> 07c3d9f08eff2b3ab07b9877857805df5f6a218d
