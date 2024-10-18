// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        try {
            const response = await axios.post('http://localhost:3000/managers/login', {
                username,
                password,
            });

            const token = response.data.token;
            localStorage.setItem('token', token); // Store the token
            console.log('Logged in successfully! Token:', token);
            // Redirect or perform additional actions upon successful login
            // Redirect to the home page after successful login
            navigate('/deliveries');
        } catch (error) {
            console.error('Login failed:', error);
            setError('Invalid username or password'); // Display an error message
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            {error && <p className="error-message">{error}</p>}
            <form onSubmit={handleLogin}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};


