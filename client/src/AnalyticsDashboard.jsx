import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import axios from 'axios';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [messageStats, setMessageStats] = useState([]);
  const [sentimentStats, setSentimentStats] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await axios.get('http://localhost:5000/analytics'); // Make sure this route exists in Flask
      setMessageStats(res.data.messages_per_day);
      setSentimentStats(res.data.sentiment_trends);
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="card">
      <h2>📈 Analytics Dashboard</h2>

      <div className="chart-section">
        <h3>Chat Usage Over Time</h3>
        <LineChart width={500} height={300} data={messageStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="messages" stroke="#8884d8" />
        </LineChart>
      </div>

      <div className="chart-section">
        <h3>Sentiment Trends</h3>
        <BarChart width={500} height={300} data={sentimentStats}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="positive" fill="#82ca9d" />
          <Bar dataKey="neutral" fill="#8884d8" />
          <Bar dataKey="negative" fill="#ff6961" />
        </BarChart>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
