import React, { useState } from 'react';
import SignInForm from './SignInForm'; // Import the SignInForm component
import SignUpForm from './SignUpForm'; // Import the SignUpForm component
import './SignContainer.css';

const SignContainer = ({onClose}) => {

    const [isSignIn, setIsSignIn] = useState(true); // State to toggle between sign-in and sign-up forms
  
  return (
    <div className="sign-container">
      {isSignIn ? <SignInForm /> : <SignUpForm />} {/* Render either sign-in or sign-up form based on state */}
    </div>
  );
};

export default SignContainer;
