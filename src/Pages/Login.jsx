// Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/Page-Styles/Login.css';
import axios from 'axios';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const appURL = import.meta.env.VITE_REACT_APP_BACKEND_URL;

    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission


        try {
            const response = await axios.post(`${appURL}/managers/login`, {
                username,
                password,
            });

            console.log('Backend URL:', appURL);


            const token = response.data.token;
            localStorage.setItem('token', token);
            localStorage.setItem('username', username); // Store the token
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
        <div className='login-page'>
            <div className='title-container'>
                <h1>
                    <p className='rainbow'>Rainbow Ace</p>
                    <p className='hardware'>Hardware</p>
                </h1>
            </div>
            <div className="login-container">
                <h2>Please Login</h2>
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
        </div>
    );
};


