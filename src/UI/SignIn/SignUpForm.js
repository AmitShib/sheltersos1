import React, { useState, useContext } from 'react';
import axios from 'axios'; 
import './SignUpForm.css'; 
import { GlobalContext } from '../../GlobalContext';

const SignUpForm = ({onClose}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isManager, setIsManager] = useState(false);
    const [showModal, setShowModal] = useState(true); 
    const { isConnected, isAdmin, setIsConnectedValue, setIsAdminValue } = useContext(GlobalContext);

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleIsManagerChange = (e) => {
        setIsManager(e.target.value === 'true'); 
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:3000/api/users', {
                userName: username,
                password: password,
                isManager: isManager, 
            });

            setIsConnectedValue(true); 
            setIsAdminValue(isManager); 
            setShowModal(false); 
            onClose();

        } catch (error) {
            console.error('Error adding user:', error);
            setIsConnectedValue(false); 
        }
    };

    const stopPropagation = (e) => {
        e.stopPropagation(); // Prevent event propagation
    };


    return (
        <div className="sign-container" onClick={stopPropagation}>
            <h2>Sign Up</h2>
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
                <div className="form-group">
                    <label htmlFor="isManager">isManager:</label>
                    <select id="isManager" value={isManager ? 'true' : 'false'} onChange={handleIsManagerChange} required>
                        <option value="false">false</option>
                        <option value="true">true</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;
