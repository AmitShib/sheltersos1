// SignInButton.js
import React from 'react';
import './SignInButton.css'; // Import the CSS file for styling

const SignInButton = ({ onSignInClick, onSignUpClick }) => {
  return (
    <div className='sign-button-container'>
      <button className="sign-button" onClick={onSignInClick}>Sign In</button>
      <button className="sign-button" onClick={onSignUpClick}>Sign Up</button>
    </div>
  );
};

export default SignInButton;
