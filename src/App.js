import React, { useRef , useState} from 'react';
import './App.css';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import SignInButton from './UI/SignIn/SignInButton';
import Modal from './UI/SignIn/Modal';
import SignContainer from './UI/SignIn/SignContainer';



function App() {

  const mapRef = useRef(null); // Create a ref for the map instance

  const [showSignInModal, setShowSignInModal] = useState(false);

  const handleSignInButtonClick = () => {
    setShowSignInModal(true);
  };

  const handleCloseModal = () => {
    setShowSignInModal(false);
  };


  return (
    <div className="App">
      <header className="App-header">
        <MapComponent mapRef={mapRef} />
        <ShelterList mapRef={mapRef} />
        <SignInButton onClick={handleSignInButtonClick} />
        {showSignInModal && (
          <Modal onClose={handleCloseModal}>
            <SignContainer />
          </Modal>
        )}

      </header>
    </div>
  );
}

export default App;
