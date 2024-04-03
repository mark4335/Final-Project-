// Nav.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Import the CSS file for Nav styles
import logo from './logo.png'; // Import the logo image

const Nav = ({ currentUser, handleLogout, handleShowPost, handleShowBoard, handleShowOffers }) => {
  const [isNavVisible, setIsNavVisible] = useState(false);

  const toggleNavVisibility = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleOptionClick = () => {
    setIsNavVisible(false); // Hide the navigation when an option is clicked
  };

  useEffect(() => {
    let timeoutId;
    if (isNavVisible) {
      timeoutId = setTimeout(() => {
        setIsNavVisible(false);
      }, 7000); // Delay in milliseconds (3 seconds)
    }
    return () => clearTimeout(timeoutId);
  }, [isNavVisible]);

  return (
    <div className="nav-container">
      {currentUser && <div className="logo" onClick={toggleNavVisibility}><img src={logo} alt="Logo" /></div>}
      
      <nav className={isNavVisible ? 'nav-visible' : ''}>

      
        <div className='nav-buttons'>
          
          <button onClick={() => { handleShowBoard(); handleOptionClick(); }}>
          Dash Board
          <br />
            <span className="note"></span>
          </button>

          <button onClick={() => { handleShowPost(); handleOptionClick(); }}>
          Post Book
          <br />
            <span className="note"></span>
          </button>

          <button onClick={() => { handleShowOffers(); handleOptionClick(); }}>
          Massages
          <br />
            <span className="note"></span>
          </button>
          <button onClick={() => { handleLogout(); handleOptionClick(); }}>
            <span className="note"></span>
            Logout
          </button>
        </div>

        {currentUser && <h3 className='User'>Welcome, {currentUser}!</h3>}
      </nav>
    </div>
  );
};

export default Nav;

