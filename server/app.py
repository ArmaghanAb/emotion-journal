"""
app.py - Flask backend for Emotion Journal
Handles journal entry analysis using OpenAI's GPT API.
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv
from collections import defaultdict
import json
from datetime import datetime
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


@app.route('/analytics')
def analytics():
    try:
        with open('chat_data.json', 'r') as f:
            data = json.load(f)

        # Count messages per day
        messages_per_day = defaultdict(int)
        sentiment_trends = defaultdict(lambda: {"positive": 0, "neutral": 0, "negative": 0})

        for item in data:
            date = item['timestamp']
            messages_per_day[date] += 1

            sentiment = item.get('sentiment', 'neutral').lower()
            if sentiment in ["positive", "negative", "neutral"]:
                sentiment_trends[date][sentiment] += 1

        # Format for charts
        messages_output = [{"date": d, "messages": count} for d, count in messages_per_day.items()]
        sentiment_output = [
            {"date": d, **vals} for d, vals in sentiment_trends.items()
        ]

        return jsonify({
            "messages_per_day": sorted(messages_output, key=lambda x: x["date"]),
            "sentiment_trends": sorted(sentiment_output, key=lambda x: x["date"])
        })

    except Exception as e:
        print("Error loading analytics:", e)
        return jsonify({"error": "Could not process analytics"}), 500


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
