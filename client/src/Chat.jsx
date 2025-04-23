// Chat.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Chat.css';

const Chat = ({ ttsEnabled, selectedVoiceURI }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMsg = { sender: 'user', text: message, time: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: message,
      });

      const aiMsg = {
        sender: 'ai',
        text: response.data.reply,
        time: Date.now(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (ttsEnabled && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(response.data.reply);
        const voice = speechSynthesis.getVoices().find((v) => v.voiceURI === selectedVoiceURI);
        if (voice) utterance.voice = voice;
        utterance.lang = 'en-US';
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      const errorMsg = {
        sender: 'ai',
        text: 'Error: Unable to connect to the chatbot.',
        time: Date.now(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setMessage('');
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setMessage(spokenText);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
    };

    recognition.start();
  };

  return (
    <div className="card">
      <h2>Emotion Journal - Chat</h2>

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
        {loading && <div className="typing-indicator">AI is thinking...</div>}
        <div ref={bottomRef}></div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="chat-textarea"
          rows="4"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          required
        />
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="chat-button" type="submit" disabled={loading}>
            {loading ? 'Thinking...' : 'Send Message'}
          </button>
          <button className="chat-button" type="button" onClick={handleSpeechInput}>
            🎤 Speak
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
