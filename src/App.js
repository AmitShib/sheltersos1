import React, { useRef, useState , useContext } from 'react';
import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import SignInButton from './UI/SignIn/SignInButton';
import Modal from './UI/SignIn/Modal';
import SignUpForm from './UI/SignIn/SignUpForm';
import SignInForm from './UI/SignIn/SignInForm';
import { GlobalProvider , GlobalContext} from './GlobalContext';


function App() {

  const mapRef = useRef(null); // Create a ref for the map instance

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // const {setIsConnectedValue, setIsAdminValue } = useContext(GlobalContext);

  const handleSignInButtonClick = () => {
    setShowSignInModal(true);
  };

  const handleSignUpButtonClick = () => {
    setShowSignUpModal(true);
  };

//   const handleSignOutButtonClick = () => {
//     setIsConnectedValue(false);
//     setIsAdminValue(false);
// };

  const handleCloseModal = () => {
    setShowSignInModal(false);
    setShowSignUpModal(false); // Close both modals when any one is closed
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
            </header>
          </div>
        )}
      </GlobalContext.Consumer>
    </GlobalProvider>

  );
}

export default App;
