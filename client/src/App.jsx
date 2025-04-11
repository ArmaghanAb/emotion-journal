// App.jsx
import React, { useState } from 'react';
import Chat from './Chat';
import JournalAnalyzer from './JournalAnalyzer';
import './App.css'; 

function App() {
  const [view, setView] = useState('chat');

  return (
    <div className="app-container">
      <h1 className="app-title">Emotion Journal</h1>

      <div className="toggle-bar">
        <button
          className={`toggle-btn ${view === 'chat' ? 'active' : ''}`}
          onClick={() => setView('chat')}
        >
          Chat
        </button>
        <button
          className={`toggle-btn ${view === 'journal' ? 'active' : ''}`}
          onClick={() => setView('journal')}
        >
          Mood Analyzer
        </button>
      </div>

      <div className="component-wrapper">
        {view === 'chat' ? <Chat /> : <JournalAnalyzer />}
      </div>
    </div>
  );
}

export default App;
