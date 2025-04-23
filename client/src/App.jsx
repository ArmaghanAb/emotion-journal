// App.jsx
import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import JournalAnalyzer from './JournalAnalyzer';
import AnalyticsDashboard from './AnalyticsDashboard';
import './App.css';

const App = () => {
  const [activeTab, setActiveTab] = useState('chat');
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    return localStorage.getItem('ttsEnabled') === 'true';
  });
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(() => {
    return localStorage.getItem('selectedVoiceURI') || '';
  });
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voiceList = synth.getVoices();
      setVoices(voiceList);
    };

    loadVoices();
    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ttsEnabled', ttsEnabled);
  }, [ttsEnabled]);

  useEffect(() => {
    localStorage.setItem('selectedVoiceURI', selectedVoiceURI);
  }, [selectedVoiceURI]);

  return (
    <div className="app-container">
      <h1 className="app-title">Emotion Journal</h1>

      <div className="toggle-bar">
        <button
          className={`toggle-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Chat
        </button>
        <button
          className={`toggle-btn ${activeTab === 'analyzer' ? 'active' : ''}`}
          onClick={() => setActiveTab('analyzer')}
        >
          Mood Analyzer
        </button>
        <button
          className={`toggle-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
        <button
          className={`toggle-btn ${ttsEnabled ? 'active' : ''}`}
          onClick={() => setTtsEnabled(!ttsEnabled)}
        >
          {ttsEnabled ? '🔊 TTS On' : '🔇 TTS Off'}
        </button>
      </div>

      <div className="voice-selector">
        <label htmlFor="voiceSelect">Select Voice:</label>
        <select
          id="voiceSelect"
          value={selectedVoiceURI}
          onChange={(e) => setSelectedVoiceURI(e.target.value)}
        >
          <option value="">Default</option>
          {voices.map((voice, i) => (
            <option key={i} value={voice.voiceURI}>
              {voice.name} ({voice.lang})
            </option>
          ))}
        </select>
      </div>

      <div className="component-wrapper">
        {activeTab === 'chat' ? (
          <Chat ttsEnabled={ttsEnabled} selectedVoiceURI={selectedVoiceURI} />
        ) : activeTab === 'analyzer' ? (
          <JournalAnalyzer />
        ) : (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  );
};

export default App;
