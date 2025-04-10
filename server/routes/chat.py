# routes/chat.py

from flask import Blueprint, request, jsonify
import openai
from langchain_community.vectorstores import FAISS  # Updated import
from langchain_openai import OpenAIEmbeddings       # Updated import
from langchain.schema import Document               # Needed for FAISS document structure
from langchain.chat_models import ChatOpenAI        # Chat model from OpenAI
from langchain.chains import ConversationalRetrievalChain  # For retrieval-augmented conversations
from chat_db import init_db, save_message, load_messages   # DB helpers

# Initialize Flask Blueprint for chat route
chat_bp = Blueprint('chat', __name__)

# Ensure DB and messages table exist
init_db()

# Set up OpenAI Embeddings model
embedding_model = OpenAIEmbeddings()

# Set up the language model
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7)

# Main chat endpoint
@chat_bp.route("/chat", methods=["POST"])
def chat():
    # Get the message sent by the user (from frontend)
    user_message = request.json.get("message", "")

    # Load all past messages from SQLite DB
    chat_history = load_messages()  # Format: [(question1, answer1), (question2, answer2), ...]

    # Convert each question in history to a LangChain Document
    # We use only questions because FAISS retrieves based on question similarity
    docs = [Document(page_content=q, metadata={}) for q, _ in chat_history]

    # Create FAISS vector store from these documents and embedding model
    vector_store = FAISS.from_documents(docs, embedding_model)

    # Create a conversational retrieval chain with the LLM and FAISS retriever
    qa = ConversationalRetrievalChain.from_llm(
        llm=llm,
        retriever=vector_store.as_retriever(),
    )

    # Run the user message through the QA chain, passing the chat history
    result = qa.run({
        "question": user_message,
        "chat_history": chat_history
    })

    # Save the new question-answer pair to the SQLite database
    save_message(user_message, result)

    # Send the AI-generated reply back to the frontend
    return jsonify({"reply": result})
