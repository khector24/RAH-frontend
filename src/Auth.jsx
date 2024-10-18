import React, { useState } from 'react';
import {
    CognitoUserPool,
    CognitoUser,
    AuthenticationDetails,
} from 'amazon-cognito-identity-js';

// Set up your Cognito User Pool
const poolData = {
    UserPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    ClientId: process.env.REACT_APP_COGNITO_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);

const Auth = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmationCode, setConfirmationCode] = useState('');
    const [accessToken, setAccessToken] = useState('');

    // Sign up a user
    const signUp = () => {
        userPool.signUp(username, password, [{ Name: 'email', Value: email }], null, (err, result) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('User signed up!', result);
        });
    };

    // Confirm user sign-up with confirmation code
    const confirmSignUp = () => {
        const user = new CognitoUser({ Username: username, Pool: userPool });
        user.confirmRegistration(confirmationCode, true, (err, result) => {
            if (err) {
                console.error(err.message);
                return;
            }
            console.log('User confirmed!', result);
        });
    };

    // Login user
    const login = () => {
        const authDetails = new AuthenticationDetails({ Username: username, Password: password });
        const user = new CognitoUser({ Username: username, Pool: userPool });

        user.authenticateUser(authDetails, {
            onSuccess: (result) => {
                const token = result.getAccessToken().getJwtToken();
                console.log('Login successful!', token);
                setAccessToken(token);
            },
            onFailure: (err) => {
                console.error(err.message);
            },
        });
    };

    return (
        <div>
            <h2>Sign Up</h2>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            <button onClick={signUp}>Sign Up</button>

            <h2>Confirm Sign Up</h2>
            <input type="text" value={confirmationCode} onChange={(e) => setConfirmationCode(e.target.value)} placeholder="Confirmation Code" />
            <button onClick={confirmSignUp}>Confirm</button>

            <h2>Login</h2>
            <button onClick={login}>Login</button>

            {accessToken && <div>Your Access Token: {accessToken}</div>}
        </div>
    );
};

export default Auth;
