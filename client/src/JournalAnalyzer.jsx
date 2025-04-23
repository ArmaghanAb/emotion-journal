// JournalAnalyzer.jsx
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './JournalAnalyzer.css';

const JournalAnalyzer = () => {
  const [entry, setEntry] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!entry.trim()) return;

    const userEntry = {
      sender: 'user',
      text: entry,
      time: Date.now(),
    };
    setMessages((prev) => [...prev, userEntry]);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/analyze', {
        entry: entry,
      });

      const aiResponse = {
        sender: 'ai',
        text: res.data.response,
        time: Date.now(),
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      const errorMsg = {
        sender: 'ai',
        text: 'Error: Could not analyze journal entry.',
        time: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setEntry('');
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="card">
      <h2>Emotion Journal - Mood Analyzer</h2>

      <div className="chat-history">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}
          >
            <p className="chat-text">{msg.text}</p>
            <span className="chat-time">
              {new Date(msg.time).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="typing-indicator">AI is thinking...</div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleAnalyze}>
        <textarea
          className="chat-textarea"
          rows="6"
          placeholder="Write about your day or how you're feeling..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          required
        />
        <button type="submit" className="chat-button" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </form>
    </div>
  );
};

export default JournalAnalyzer;