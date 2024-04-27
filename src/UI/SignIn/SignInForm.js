// SignInForm.js
import React, { useState, useContext } from 'react';
import './SignInForm.css'; // Import the CSS file for styling
import { GlobalContext } from '../../GlobalContext';
import axios from 'axios'; // Import axios


const SignInForm = ({onClose}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(true); // Add a state for modal visibility
  const { isConnected, isAdmin, setIsConnectedValue, setIsAdminValue } = useContext(GlobalContext);

  console.log("connected:",isConnected);
  console.log("admin:",isAdmin);


  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitted:', { username, password });

    try {
      // Send a GET request to check if the user exists
      const response = await axios.get(`http://localhost:3000/api/users/${username}`);
      const user = response.data;

      // Check if the user exists and the password matches
      if (user && user.password === password) {
        setIsConnectedValue(true); // Set isConnected to true
        setIsAdminValue(user.isManager); // Set isAdmin based on the user's isManager value

        console.log("connected:",isConnected);
        console.log("admin:",isAdmin);      
        console.log('User authenticated:', user);

        setShowModal(false); // Set showModal to false to close the modal
        onClose();

      } else {
        console.log('Invalid username or password');
        setIsConnectedValue(false); // Set isConnected to false
        setIsAdminValue(false); // Set isAdmin to false
        // You can add additional logic here, such as displaying an error message
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      setIsConnectedValue(false); // Set isConnected to false
      setIsAdminValue(false); // Set isAdmin to false
    }

  };

  const stopPropagation = (e) => {
    e.stopPropagation(); // Prevent event propagation
  };


  return (
    <div className="signin-form-container" onClick={stopPropagation}>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignInForm;
