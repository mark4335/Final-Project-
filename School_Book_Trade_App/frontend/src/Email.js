// Email.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Email = ({ senderEmail, receiverEmail }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const sendEmail = async () => {
      try {
        await axios.post('http://localhost:3001/send-email', {
          sender_email: senderEmail,
          receiver_email: receiverEmail,
          subject: 'Book Request',
          text: `${senderEmail} is requesting the book. Please reply.`,
        });
        console.log('Email sent successfully.');
        setIsEmailSent(true);
        setErrorMessage('');
      } catch (error) {
        console.error('Error sending email:', error);
        setIsEmailSent(false);
        setErrorMessage('Email not sent. Please try again later.'); // Set error message
      }
    };

    sendEmail();
  }, [senderEmail, receiverEmail]); // Trigger sending email when senderEmail or receiverEmail changes

  // Render message based on email sending status
  return (
    <div>
      {isEmailSent ? (
        <p>Email sent successfully!</p>
      ) : (
        <p>{errorMessage}</p>
      )}
    </div>
  );
};

export default Email;
