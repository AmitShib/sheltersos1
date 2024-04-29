import React, { useContext } from 'react';
import './SignInButton.css'; 
import { GlobalContext } from '../../GlobalContext';

const SignInButton = ({ onSignInClick, onSignUpClick, onSignOutClick }) => {

  const { isConnected } = useContext(GlobalContext);

  return (
    <div className="sign-button-container">
      {isConnected ? (
        <button className="sign-button" onClick={onSignOutClick}>
          Sign Out
        </button>
      ) : (
        <>
          <button className="sign-button" onClick={onSignInClick}>
            Sign In
          </button>
          <button className="sign-button" onClick={onSignUpClick}>
            Sign Up
          </button>
        </>
      )}
    </div>
  );
};

export default SignInButton;
