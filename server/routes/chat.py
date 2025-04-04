# routes/chat.py

from flask import Blueprint, request, jsonify
import openai
from langchain.vectorstores import FAISS
from langchain.embeddings import OpenAIEmbeddings
from langchain.schema import Document
from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationalRetrievalChain

chat_bp = Blueprint('chat', __name__)

# Set up embedding model
embedding_model = OpenAIEmbeddings()

# Initialize vector store 
vector_store = FAISS.from_documents([], embedding_model)

# Initialize LLM
llm = ChatOpenAI(model_name="gpt-3.5-turbo", temperature=0.7)

# Setup conversation chain with retriever
qa = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=vector_store.as_retriever(),
)

# Store chat history in memory
chat_history = []

@chat_bp.route("/chat", methods=["POST"])
def chat():
    user_message = request.json.get("message", "")

    # Run through the vector-based chatbot
    result = qa.run({
        "question": user_message,
        "chat_history": chat_history
    })

    # Save to chat history
    chat_history.append((user_message, result))

    return jsonify({"reply": result})
