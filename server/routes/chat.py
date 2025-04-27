# routes/chat.py

from flask import Blueprint, request, jsonify
import openai
from openai import OpenAI
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.schema import Document
from langchain.chains import ConversationalRetrievalChain
from chat_db import init_db, save_message, load_messages
from dotenv import load_dotenv
import os
import json
from datetime import datetime

# Load environment variables
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")

# Initialize Flask Blueprint
chat_bp = Blueprint('chat', __name__)

# Ensure DB exists
init_db()

# Initialize embeddings and chat models
embedding_model = OpenAIEmbeddings(openai_api_key=openai_api_key)
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7, openai_api_key=openai_api_key)

#  Main Chat Route
@chat_bp.route("/chat", methods=["POST", "OPTIONS"])
def chat():
    if request.method == "OPTIONS":
        return jsonify({"message": "CORS preflight"}), 200

    try:
        data = request.get_json(force=True)  # Parses even if headers are off
        user_message = data.get("message", "")
        if not user_message:
            return jsonify({"error": "Message is required"}), 400

        # Load history and build FAISS
        chat_history = load_messages()
        
        # Handle empty history safely
        if not chat_history:
            result = llm.predict(user_message)
            save_message(user_message, result)
            return jsonify({"reply": result})
        
        docs = [Document(page_content=q, metadata={}) for q, _ in chat_history]
        vector_store = FAISS.from_documents(docs, embedding_model)

        # Run LangChain QA
        qa = ConversationalRetrievalChain.from_llm(
            llm=llm,
            retriever=vector_store.as_retriever(),
        )
        result_obj = qa.invoke({
        "question": user_message,
        "chat_history": chat_history
        })
        result = result_obj["answer"]


        ai_text = result if isinstance(result, str) else str(result)
        save_message(user_message, ai_text)
        return jsonify({"reply": result})

    except Exception as e:
        print("Chat error:", str(e))
        return jsonify({"error": "Unable to connect to the chatbot."}), 500


def log_chat_to_json(user_message, ai_reply, sentiment="neutral"):
    today = datetime.now().strftime("%Y-%m-%d")

    new_entry = {
        "timestamp": today,
        "message": user_message,
        "reply": ai_reply,
        "sentiment": sentiment  # this will be added in Step 2
    }

    try:
        with open("chat_data.json", "r") as f:
            data = json.load(f)
    except FileNotFoundError:
        data = []

    data.append(new_entry)

    with open("chat_data.json", "w") as f:
        json.dump(data, f, indent=2)
        
def classify_sentiment(message):
    
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    prompt = f"Classify the sentiment of this message as positive, negative, or neutral: {message}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0
    )

    sentiment = response.choices[0].message.content.strip().lower()
    return sentiment if sentiment in ["positive", "negative", "neutral"] else "neutral"
      