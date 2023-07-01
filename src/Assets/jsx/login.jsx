import React, { useState, useEffect } from 'react';
import '../css/log.css';

const LogCheck = () => {
    useEffect(() => {
        if (document.cookie.includes("dataID")) {
            document.cookie = "dataID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
    }, []);

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
        if (e) {
            e.preventDefault();
        }

        if (username === '') {
            setError('Username is required');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        if (password === '') {
            setError('Password is required');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        const sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
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

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            handleSubmit(e);
        }
    });

    return (
        <div className='LoginContainer'>
            <span id="BackgroundImage">
                <br /><br /><br />
                <h1 id="CopyrightedMaterial">© MrWai.com</h1>
            </span>
            <p id="LoginLabel">Login</p>
            <br /><br />
            <form>
                <input type="text"
                    autoComplete='username'
                    placeholder='Username'
                    id="username"
                    spellCheck="false"
                    onChange={handleUsernameChange}
                    onBlur={handleUsernameChange}
                />
                <br /><br />
                <input
                    type="password"
                    autoComplete='password'
                    placeholder='Password'
                    id="password"
                    spellCheck="false"
                    onChange={handlePasswordChange}
                    onBlur={handlePasswordChange}
                />
                <br /><br />
                <h1 id="Error">{error}</h1>
                <button type="submit" id="LoginButton" onClick={() => handleSubmit()}>Login</button>
            </form>
            <br /><br />
            <a href='http://localhost:3001/auth/google' className="googlesignin"><span className="fa fa-google" />Register/Sign In with Google</a>
        </div>
    );
};

export default LogCheck;
