import React, { useState } from 'react';
import axios from 'axios'; // Import axios
import './SignUpForm.css'; // Import the CSS file for styling

const SignUpForm = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [permission, setPermission] = useState('false');

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
            const response = await axios.post('http://localhost:3000/api/users', {
                userName: username,
                password: password,
                isManager: permission === 'option2', // Set isManager based on the selected permission
            });

            console.log('User added:', response.data);
            // You can add additional logic here, such as displaying a success message or clearing the form
        } catch (error) {
            console.error('Error adding user:', error);
            // You can add error handling logic here, such as displaying an error message
        }
    };

    const stopPropagation = (e) => {
        e.stopPropagation(); // Prevent event propagation
    };


    return (
        <div className="sign-container" onClick={stopPropagation}>
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
                <div className="form-group">
                    <label htmlFor="permission">isManager:</label>
                    <select id="permission" required>
                        <option value="option1">false</option>
                        <option value="option2">true</option>
                    </select>
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default SignUpForm;
