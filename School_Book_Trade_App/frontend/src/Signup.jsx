import React, { useState } from 'react';

const Signup = ({ setCurrentUser }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Validation: Check if password and confirm password match
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please make sure your passwords match.');
      return;
    }

    // Your signup logic here
    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (response.ok) {
        // Set the current user email
        setCurrentUser(email);
        setError('');
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('Oops! Something went wrong on our end. Please try again later.');
    }
  };

  return (
    <div className='Sign-Container'>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
        <input
          type="text" required
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email" required
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password" required
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password" required
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
