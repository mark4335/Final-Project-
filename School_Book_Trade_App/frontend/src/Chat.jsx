import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; // Import the external CSS file

const Chat = ({ currentUser, selectedOffer }) => {
  // State variables to manage messages, loading state, and errors
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch messages from the server when the component mounts or currentUser changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/offers/${currentUser}`);
        setMessages(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching messages:', error);
        setError('Error fetching messages');
        setLoading(false);
      }
    };

    fetchMessages();
  }, [currentUser]);

  // Render loading message if data is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render error message if there was an error fetching data
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Filter messages based on selectedOffer and currentUser
  const filteredMessages = messages.filter(message => 
    message.book_id === selectedOffer.book_id &&
    (message.sender_email === selectedOffer.sender_email || message.sender_email === currentUser)
  );

  // Sort messages by timestamp
  filteredMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

  return (
    <div className="chat-container">
      <h3>Chat with {selectedOffer.sender_email}</h3>
       
      {filteredMessages.map((message, index) => (
        <div key={index} className={`message-container ${message.sender_email === selectedOffer.sender_email ? 'selected' : 'not-selected'}`}>
          {/* Display message timestamp */}
          <p className="message-info">
            <span className="timestamp">{message.timestamp}</span>
          </p>
          {/* Display message content */}
          <p className={`message-content ${message.sender_email === currentUser ? 'message-sender' : 'message-recipient'}`}>
            {message.message_content}
          </p>
          {/* Display sender's email */}
          <p className="sender-info">Sender: {message.sender_email}</p>
        </div>
      ))}
    </div>
  );
};

export default Chat;
