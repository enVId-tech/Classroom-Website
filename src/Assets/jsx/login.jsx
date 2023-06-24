import React, { useState } from 'react';

const LogCheck = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (username === '') {
            setError('Username is required');
            return;
        }

        if (password === '') {
            setError('Password is required');
            return;
        }

        const data = {
            username,
            password,
        };

        const sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        };

        try {
            const response = await fetch('/student/data/login', sendData);
            const res = await response.json();
            if (res.error) {
                setError(res.error);
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
            if (res.success) {
                window.location.href = '/';
            }
        } catch (error) {
            // Handle fetch or JSON parsing error
            console.log('An error occurred:', error);
        }
    };

    return (
        <div>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
                <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LogCheck;
