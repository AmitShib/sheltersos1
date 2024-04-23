// SignInButton.js
import React from 'react';
import './SignInButton.css'; // Import the CSS file for styling

const SignInButton = ({ onClick }) => {
  return (
    <button className="sign-in-button" onClick={onClick}>Sign In</button>
  );
};

export default SignInButton;
