import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chat from './Chat'; // Importing the Chat component
import Message from './Message'; // Importing the Message component

// Component for displaying offers
const Offers = ({ currentUser }) => {
  const [offers, setOffers] = useState([]); // State for storing offers
  const [selectedOffer, setSelectedOffer] = useState(null); // State for tracking selected offer

  useEffect(() => {
    // Function to fetch offers from the server
    const fetchOffers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/offers/${currentUser}`); // Fetching offers for the current user
        // Removing duplicate offers based on book_id and sender_email
        const uniqueOffers = response.data.reduce((acc, current) => {
          const x = acc.find(item => item.book_id === current.book_id && item.sender_email === current.sender_email);
          if (!x) {
            return acc.concat([current]);
          } else {
            return acc;
          }
        }, []);
        setOffers(uniqueOffers); // Setting the unique offers in state
      } catch (error) {
        console.error('Error fetching offers:', error); // Handling errors
      }
    };

    fetchOffers(); // Calling the fetchOffers function when the component mounts or when currentUser changes
  }, [currentUser]); // Dependency array to trigger the effect when currentUser changes

  // Function to handle clicking on an offer
  const handleOfferClick = (offer) => {
    setSelectedOffer(offer); // Setting the selectedOffer state to the clicked offer
  };

  return (
    <div className='Offers-container'>
      {/* Mapping through the offers and rendering offer items */}
      {offers.map((offer, index) => (
        // Check if the offer sender is not the current user before rendering
        (offer.sender_email !== currentUser) && (
          <div key={`${offer.id}-${index}`} className="offer-item">
            <div className="offer-details" onClick={() => handleOfferClick(offer)}> {/* Click event to select an offer */}
              <h3> {offer.sender_email}</h3>
              <div>
                <p><strong>Book ID:</strong> {offer.book_id}</p>
                <p><strong>Book:</strong> {offer.book_name}</p>
              </div>
            </div>
            {/* Rendering Chat and Message components if an offer is selected */}
            {selectedOffer && selectedOffer.book_id === offer.book_id && selectedOffer.sender_email === offer.sender_email && (
              <div className="chat-window">
                <Chat currentUser={currentUser} selectedOffer={selectedOffer} /> {/* Passing currentUser and selectedOffer as props */}
                <Message senderEmail={currentUser} receiverEmail={selectedOffer.sender_email} bookId={selectedOffer.book_id} /> {/* Passing senderEmail, receiverEmail, and bookId as props */}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default Offers; // Exporting the Offers component
