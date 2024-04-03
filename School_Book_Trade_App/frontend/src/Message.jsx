// Message.js

import React, { useState } from 'react';
import axios from 'axios';

const Message = ({ senderEmail, receiverEmail, bookId }) => {
  const [messageContent, setMessageContent] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  const handleMessageSend = async () => {
    try {
      await axios.post('http://localhost:3001/messages', {
        sender_email: senderEmail,
        receiver_email: receiverEmail,
        book_id: bookId,
        message_content: messageContent
      });
      // Clear input after sending message
      setMessageContent('');
      // Set state to indicate message has been sent
      setIsMessageSent(true);
    } catch (error) {
      console.error('Error sending message:', error);
      // Handle error gracefully
    }
  };

  return (
    <div className="message">
      <input
        type="text"
        placeholder="Enter your message"
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
      />
      <button onClick={handleMessageSend}>Send</button>
      {/* Conditionally render message sent confirmation */}
      {isMessageSent && <p className="message-sent">Message sent!</p>}
    </div>
  );
};

export default Message;
