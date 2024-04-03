// Post.jsx


import './App.css'; // Import the CSS file for Nav styles

import React, { useState } from 'react';

const Post = ({ userEmail }) => {
  const [name, setName] = useState('');
  const [school, setSchool] = useState('');
  const [subject, setSubject] = useState('');
  const [book, setBook] = useState('');
  const [condition, setCondition] = useState('');
  const [price, setPrice] = useState('');
  // const [image, setImage] = useState(null);

  const handlePost = async () => {
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('userEmail', userEmail);
      formData.append('school', school);
      formData.append('subject', subject);
      formData.append('book', book);
      formData.append('condition', condition);
      formData.append('price', price);
      // formData.append('image', image);

      const response = await fetch('http://localhost:3001/createBook', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log('Book created successfully');
        // Handle any additional logic, e.g., redirect to a different page
      } else {
        console.error('Error creating book:', await response.text());
        // Handle the error
      }
    } catch (error) {
      console.error('Error during book creation:', error);
      // Handle the error
    }
  };

  return (
    <div className="post-container">
      <h2>Create a New Book Entry</h2>
      <label>Name:</label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />

      <label>School:</label>
      <input type="text" value={school} onChange={(e) => setSchool(e.target.value)} />

      <label>Subject:</label>
      <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} />

      <label>Book:</label>
      <input type="text" value={book} onChange={(e) => setBook(e.target.value)} />

      <label>Condition:</label>
      <input type="textarea" value={condition} onChange={(e) => setCondition(e.target.value)} />

      <label>Price:</label>
      <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />

      {/* <label>Image:</label>
      <input type="file" onChange={(e) => setImage(e.target.files[0])} /> */}

      <button onClick={handlePost}>Post</button>
    </div>
  );
};

export default Post;