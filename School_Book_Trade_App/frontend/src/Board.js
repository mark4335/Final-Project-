// Board.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Search from './Search';
import Message from './Message';

const Board = ({ currentUser }) => {
  const [books, setBooks] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null); // State to track the selected card ID

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/books');
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (searchText) => {
    const filteredBooks = books.filter((book) =>
      book.book.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(filteredBooks);
  };

  const handleDelete = async (bookId) => {
    try {
      await axios.delete(`http://localhost:3001/books/${bookId}`, { headers: { useremail: currentUser } });
      fetchData();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleCardClick = (cardId) => {
    setSelectedCardId(cardId);
  };

  return (
    <div>
      <Search onSearch={handleSearch} />

      <div className="board">
        {searchResults.length > 0 ? (
          searchResults.map((book) => (
            <div key={book.id} className="card" onClick={() => handleCardClick(book.id)}> {/* Added onClick handler */}
              {/* Display book details */}
              <h3>{book.name}</h3>
              <p>School: {book.school}</p>
              <p>Subject: {book.subject}</p>
              <p>Book: {book.book}</p>
              <p>Condition: {book.book_condition}</p>
              <p>Price: ${book.price}</p>
              


              {currentUser === book.useremail && (
                <button onClick={() => handleDelete(book.id)}>Delete</button>
              )}

              {/* Display message component only when the card is clicked */}
              {selectedCardId === book.id && (
                <Message
                  senderEmail={currentUser}
                  receiverEmail={book.useremail}
                  bookId={book.id}
                />
              )}
            </div>
          ))
        ) : (
          books.map((book) => (
            <div key={book.id} className="card" onClick={() => handleCardClick(book.id)}> {/* Added onClick handler */}
              {/* Display book details */}

              
              <h3>{book.book}</h3>
              <div className = "image">{book.image}</div>
              <p>School: {book.school}</p>
              <p>Subject: {book.subject}</p>
              <p>Condition: {book.book_condition}</p>
              <p>Price: ${book.price}</p>
              

              {currentUser === book.useremail ? (
                <button className='delete' onClick={() => handleDelete(book.id)}>Delete</button>
              ) : (
                /* Display message component only when the card is clicked */
                selectedCardId === book.id && (
                  
                  <Message
                    senderEmail={currentUser}
                    receiverEmail={book.useremail}
                    bookId={book.id}
                  />
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Board;
