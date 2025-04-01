from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import os
from dotenv import load_dotenv

load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = Flask(__name__)
CORS(app)

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.json
    entry = data.get("entry", "")

    # Prompt OpenAI
    prompt = f"You're a helpful AI assistant. Analyze the emotional tone of this journal entry and respond with a one-word mood (like Happy, Anxious, Calm), followed by a one-sentence supportive reflection:\n\n{entry}\n\nResponse:"
    
    response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7
    )

    ai_output = response.choices[0].message["content"]
    return jsonify({"response": ai_output})

if __name__ == "__main__":
    app.run(debug=True)
