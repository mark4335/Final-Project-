import React, { useState } from 'react';

const Signin = ({ setCurrentUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignin = async () => {
    // Your signin logic here
    try {
      const response = await fetch('http://localhost:3001/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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
        if (response.status === 401) {
          setError('Invalid email or password. Please check your credentials and try again.');
        } else if (response.status === 500) {
          setError('Oops! Something went wrong on our end. Please try again later.');
        } else {
          setError(`Sorry ${errorMessage}`);
        }
      }
    } catch (error) {
      console.error('Error during signin:', error);
      setError('Oops! Something went wrong on our end. Please try again later.');
    }
  };

  return (
    <div className='Sign-Container'>
      <h2>Sign In</h2>
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
      <button onClick={handleSignin}>Sign In</button>
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
    </div>
  );
};

export default Signin;
