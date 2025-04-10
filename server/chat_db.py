"""
chat_db.py
Handles saving and loading chat messages using SQLite.
"""

import sqlite3

# Initialize the database and create a messages table (if not exists)
def init_db():
    conn = sqlite3.connect("chat.db")  # Connect to SQLite database (or create if it doesn't exist)
    cursor = conn.cursor()

    # Create a table to store messages
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    conn.commit()
    conn.close()


# Save a chat message to the database
def save_message(question, answer):
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    # Insert the question and answer into the messages table
    cursor.execute("INSERT INTO messages (question, answer) VALUES (?, ?)", (question, answer))

    conn.commit()
    conn.close()


# Load all past messages (for FAISS or history)
def load_messages():
    conn = sqlite3.connect("chat.db")
    cursor = conn.cursor()

    # Get all (question, answer) rows
    cursor.execute("SELECT question, answer FROM messages")
    rows = cursor.fetchall()

    conn.close()
    return rows  # Returns a list of tuples: [(q1, a1), (q2, a2), ...]
