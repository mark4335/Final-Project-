import React, { useState } from 'react';

const Reply = ({ offerId, bookId, handleReply }) => {
  const [replyMessage, setReplyMessage] = useState('');

  const onReply = () => {
    handleReply(offerId, bookId, replyMessage);
    setReplyMessage('');
  };

  return (
    <>
      <input
        type="text"
        placeholder="Type your reply..."
        value={replyMessage}
        onChange={(e) => setReplyMessage(e.target.value)}
        id={`replyInput_${offerId}`} // Unique ID for each input
      />
      <button onClick={onReply}>Reply</button>
    </>
  );
};

export default Reply;
