import axios from 'axios';
import React, { useContext, useState } from 'react';
import { GlobalContext } from '../../GlobalContext';
import './SignInForm.css';


const SignInForm = ({onClose}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showModal, setShowModal] = useState(true); 
  const { isConnected, isAdmin, setIsConnectedValue, setIsAdminValue } = useContext(GlobalContext);

  
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get(`http://localhost:3000/api/users/${username}`);
      const user = response.data;

      if (user && user.password === password) {
        setIsConnectedValue(true); 
        setIsAdminValue(user.isManager); 
        setShowModal(false); 
        onClose();

      } else {
        console.log('Invalid username or password');
        setIsConnectedValue(false); 
        setIsAdminValue(false); 
      }
    } catch (error) {
      console.error('Error authenticating user:', error);
      setIsConnectedValue(false); 
      setIsAdminValue(false); 
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
