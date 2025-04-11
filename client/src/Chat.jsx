
import React, { useState } from 'react';
import axios from 'axios';
import './Chat.css';

// Define the Chat component
const Chat = () => {
  const [message, setMessage] = useState('');
  const [reply, setReply] = useState('');
  const [loading, setLoading] = useState(false);  // State to track loading state (used for button disabling and feedback)

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);  

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: message,
      });

      setReply(response.data.reply);

      // Clear the message input field
      setMessage('');
    } catch (error) {
      console.error('Error communicating with backend:', error);
      setReply('Error: Unable to connect to the chatbot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h2>Emotion Journal - Chat</h2>

      {/* Chat input form */}
      <form onSubmit={handleSubmit}>
        <textarea
          rows="4"
          style={{ width: '100%', marginBottom: '1rem' }}
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update state as user types
          placeholder="Type your message here..."
          required
        />

        {/* Submit button with loading state */}
        <button className="chat-button" type="submit" disabled={loading}>
          {loading ? 'Thinking...' : 'Send Message'}
        </button>
      </form>

      {/* Display the AI's reply if available */}
      {reply && (
        <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f0f0f0' }}>
          <strong>AI:</strong> {reply}
        </div>
      )}
    </div>
  );
};

export default Chat;
