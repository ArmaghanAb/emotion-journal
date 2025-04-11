// client/src/JournalAnalyzer.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './JournalAnalyzer.css';

const JournalAnalyzer = () => {
  // State for user entry input
  const [entry, setEntry] = useState('');

  // State for AI response
  const [response, setResponse] = useState('');

  // Loading state
  const [loading, setLoading] = useState(false);

  // Handle submit
  const handleAnalyze = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // POST journal entry to Flask backend
      const res = await axios.post('http://localhost:5000/analyze', {
        entry: entry,
      });

      // Set AI response
      setResponse(res.data.response);
      setEntry('');
    } catch (err) {
      console.error('Error analyzing journal:', err);
      setResponse('Error: Could not analyze journal entry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Emotion Journal - Mood Analyzer</h2>

      <form onSubmit={handleAnalyze}>
        <textarea
          rows="6"
          style={{ width: '100%', marginBottom: '1rem' }}
          placeholder="Write about your day or how you're feeling..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          required
        />
        <button type="submit" className="chat-button" disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Mood'}
        </button>
      </form>

      {/* Show response if available */}
      {response && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e0f7fa' }}>
          <strong>AI Response:</strong> {response}
        </div>
      )}
    </div>
  );
};

export default JournalAnalyzer;
