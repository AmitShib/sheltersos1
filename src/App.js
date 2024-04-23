import React, { useRef, useState } from 'react';
import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import SignInButton from './UI/SignIn/SignInButton';
import Modal from './UI/SignIn/Modal';
import SignUpForm from './UI/SignIn/SignUpForm';
import SignInForm from './UI/SignIn/SignInForm';


function App() {

  const mapRef = useRef(null); // Create a ref for the map instance

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const handleSignInButtonClick = () => {
    setShowSignInModal(true);
  };

  const handleSignUpButtonClick = () => {
    setShowSignUpModal(true);
  };

  const handleCloseModal = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false); // Close both modals when any one is closed
  };


  return (
    <div className="App">
      <header className="App-header">
        <MapComponent mapRef={mapRef} />
        <ShelterList mapRef={mapRef} />
        <SignInButton onSignInClick={handleSignInButtonClick} onSignUpClick={handleSignUpButtonClick} /> {/* Pass handlers for sign-in and sign-up buttons */}
        {showSignInModal && (
          <Modal onClose={handleCloseModal}>
            <SignInForm />
          </Modal>
        )}
        {showSignUpModal && (
          <Modal onClose={handleCloseModal}>
            <SignUpForm /> {/* Pass onClose handler to close the modal */}
          </Modal>
        )}

      </header>
    </div>
  );
}

export default App;
