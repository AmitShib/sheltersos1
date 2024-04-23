import React from 'react';
import SignInForm from './SignInForm'; // Import the SignInForm component
import './SignContainer.css';

const SignContainer = () => {
  return (
    <div className="sign-container">
      <SignInForm /> 
    </div>
  );
};

export default SignContainer;
