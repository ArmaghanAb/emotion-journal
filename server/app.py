"""
app.py - Flask backend for Emotion Journal
Handles journal entry analysis using OpenAI's GPT API.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from routes.chat import chat_bp


app.register_blueprint(chat_bp)


# Load environment variables
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Route to analyze emotional tone using OpenAI
@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    entry = data.get("entry", "")

     # Create a prompt for the AI
    prompt = f"You're a helpful AI assistant. Analyze the emotional tone of this journal entry and respond with a one-word mood (like Happy, Anxious, Calm), followed by a one-sentence supportive reflection:\n\n{entry}\n\nResponse:"
    
    # Call the OpenAI API
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    # Extract and return AI-generated response
    ai_output = response.choices[0].message["content"]
    return jsonify({"response": ai_output})

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
