import React, { useRef, useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { GlobalContext, GlobalProvider } from './GlobalContext';
import MapComponent from './Map/MapComponent';
import ShelterList from './UI/ShelterList';
import Modal from './UI/SignIn/Modal';
import SignInButton from './UI/SignIn/SignInButton';
import SignInForm from './UI/SignIn/SignInForm';
import SignUpForm from './UI/SignIn/SignUpForm';
import axios from 'axios';


function App() {

  const mapRef = useRef(null);

  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/reports');
        const parsedReports = response.data.map(report => ({
          ...report,
          shelterNum: parseInt(report.shelterNum, 10)
        }));
        setReports(parsedReports);
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };

    fetchReports();
  }, []);


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
