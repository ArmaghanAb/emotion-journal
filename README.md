
# Emotion Journal

An AI-powered mental health companion that allows users to track their emotions, analyze their mood trends, and interact with a supportive chatbot.

Emotion Journal combines AI technologies like OpenAI and LangChain with a modern full-stack architecture to help users better understand their mental wellness over time. It features real-time conversation, sentiment analysis, text-to-speech (TTS), speech-to-text input, and a live analytics dashboard.

![App Walkthrough](src/assets/Walkthrough.gif)


---

## 🌟 Features

- **Chatbot powered by OpenAI + LangChain**: Provides emotionally supportive, AI-driven conversations.
- **Mood Analyzer**: Analyzes journal entries and provides one-word mood summaries with supportive reflections.
- **Live Analytics Dashboard**: Visualizes message counts and sentiment trends over time.
- **Text-to-Speech (TTS)**: Reads AI responses aloud to users.
- **Speech Recognition Input**: Allows users to speak journal entries instead of typing.

---

## 🚀 How to Install and Run Locally

### 1. Clone the Repository
```bash
https://github.com/your-github-username/emotion-journal.git
cd emotion-journal
```

### 2. Backend Setup (Flask)
```bash
cd server
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Add your OPENAI_API_KEY in the .env file

# Run the server
python app.py
```
Backend runs at: `http://localhost:5000`

### 3. Frontend Setup (React)
```bash
cd client
npm install
npm run dev
```
Frontend runs at: `http://localhost:5173`

---

## 🛠️ Technologies Used

### Frontend
- React.js
- Vite
- JavaScript, HTML, CSS
- Recharts (for analytics dashboard)
- Web Speech API (TTS and Speech Recognition)

### Backend
- Python
- Flask
- LangChain
- OpenAI API
- SQLite (for chat history)

### Tools
- Git & GitHub
- Postman (for API testing)
- dotenv (for environment variable management)

---

## 💡 Project Motivation

Mental health is one of the most critical yet underserved areas, especially for people who need immediate, private emotional support.

The idea behind **Emotion Journal** is to create a personal space where users can:
- Express their feelings freely.
- Get supportive AI feedback.
- Monitor their emotional trends over time.
- Feel heard and understood even outside professional therapy.

By combining conversational AI with real-time analytics, Emotion Journal encourages mindfulness, reflection, and positive growth.

---

## 📄 License

This project is for educational and personal portfolio purposes only.

---

## 🙌 Acknowledgments

- OpenAI for providing amazing API capabilities
- LangChain for easy integration of retrieval-augmented generation (RAG)

> Built with ❤️ by Armaghan Abtahi
