import React, { useRef, useState , useContext } from 'react';
import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import SignInButton from './UI/SignIn/SignInButton';
import Modal from './UI/SignIn/Modal';
import SignUpForm from './UI/SignIn/SignUpForm';
import SignInForm from './UI/SignIn/SignInForm';
import { GlobalProvider , GlobalContext} from './GlobalContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {

  const mapRef = useRef(null); 

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
    setShowSignUpModal(false); 
  };


  return (
    <GlobalProvider>
      <GlobalContext.Consumer>
        {({ setIsConnectedValue, setIsAdminValue }) => (
          <div className="App">
            <header className="App-header">
              <MapComponent mapRef={mapRef} />
              <ShelterList mapRef={mapRef} />
              <SignInButton
                onSignInClick={handleSignInButtonClick}
                onSignUpClick={handleSignUpButtonClick}
                onSignOutClick={() => {
                  setIsConnectedValue(false);
                  setIsAdminValue(false);
                }}
              />
              {showSignInModal && (
                <Modal onClose={handleCloseModal}>
                  <SignInForm onClose={handleCloseModal} />
                </Modal>
              )}
              {showSignUpModal && (
                <Modal onClose={handleCloseModal}>
                  <SignUpForm onClose={handleCloseModal} />
                </Modal>
              )}
              <ToastContainer />
            </header>
          </div>
        )}
      </GlobalContext.Consumer>
    </GlobalProvider>

  );
}

export default App;
