// App.js

import React, { useState } from 'react';
import Signup from './Signup';
import Signin from './Signin';
import Post from './Post';
import Board from './Board';
import Nav from './Nav';
import Offers from './Offers'; // Import the Offers component
import './App.css'; // Import the CSS file for styling

const App = () => {
  const [currentUser, setCurrentUser] = useState('');
  const [showPost, setShowPost] = useState(false);
  const [showBoard, setShowBoard] = useState(false);
  const [showOffers, setShowOffers] = useState(false); // State to control showing offers

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser('');
    setShowPost(false);
    setShowBoard(false);
    setShowOffers(false); // Hide offers on logout
  };

  const handleShowPost = () => {
    setShowPost(true);
    setShowBoard(false); // Hide Board when showing Post
    setShowOffers(false); // Hide Offers when showing Post
  };

  const handleHidePost = () => {
    setShowPost(false);
    setShowBoard(false);
    setShowOffers(false);
  };

  const handleShowBoard = () => {
    setShowBoard(true);
    setShowPost(false); // Hide Post when showing Board
    setShowOffers(false); // Hide Offers when showing Board
  };

  // Function to handle showing offers
  const handleShowOffers = () => {
    setShowOffers(true);
    setShowPost(false); // Hide Post when showing Offers
    setShowBoard(false); // Hide Board when showing Offers
  };

  return (
    <div className="app-container">
      <div className="nav-and-title">
      {currentUser && <Nav
        currentUser={currentUser}
        handleLogout={handleLogout}
        handleShowPost={handleShowPost}
        handleHidePost={handleHidePost}
        handleShowBoard={handleShowBoard}
        handleShowOffers={handleShowOffers} // Pass the handleShowOffers function to the Nav component
      />}

      
        <h1>School Book Market</h1>
      </div>

      {currentUser ? (
        <div>
          {/* Show Post, Board, or Offers based on state */}
          {showPost ? <Post userEmail={currentUser} /> : null}
          {showBoard ? <Board currentUser={currentUser} /> : null}
          {showOffers ? <Offers currentUser={currentUser} /> : null} {/* Render the Offers component if showOffers is true */}
        </div>
      ) : (
        <div>
           <Signin setCurrentUser={handleLoginSuccess} />
           <Signup setCurrentUser={handleLoginSuccess} />
        </div>
      )}
    </div>
  );
};

export default App;
