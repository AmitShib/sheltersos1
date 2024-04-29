import React, { useState, useContext } from 'react';
import axios from 'axios'; // Import axios
import './SignUpForm.css'; // Import the CSS file for styling
import { GlobalContext } from '../../GlobalContext';

const SignUpForm = ({onClose}) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isManager, setIsManager] = useState(false);
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

    const handleIsManagerChange = (e) => {
        setIsManager(e.target.value === 'true'); // Update isManager based on the select value
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitted:', { username, password });

        try {
            const response = await axios.post('http://localhost:3000/api/users', {
                userName: username,
                password: password,
                isManager: isManager, // Set isManager based on the selected permission
            });

            setIsConnectedValue(true); // Set isConnected to true
            setIsAdminValue(isManager); // Set isAdmin based on the selected permission

            console.log('User added:', response.data);
            console.log("connected:",isConnected);
            console.log("admin:",isAdmin);

            setShowModal(false); // Set showModal to false to close the modal
            onClose();
            // You can add additional logic here, such as displaying a success message or clearing the form
        } catch (error) {
            console.error('Error adding user:', error);
            setIsConnectedValue(false); // Set isConnected to false in case of an error
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
