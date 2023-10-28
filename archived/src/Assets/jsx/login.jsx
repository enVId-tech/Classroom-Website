import React, { useState } from 'react';
import '../css/log.css';

const LogCheck = () => {
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        if (e) {
            e.preventDefault();
        }

        if (document.getElementById('username').value === '') {
            setError('Username is required');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        if (document.getElementById('password').value === '') {
            setError('Password is required');
            setTimeout(() => {
                setError('');
            }, 3000);
            return;
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

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
                <h1 id="CopyrightedMaterial">© test</h1>
            </span>
            <p id="LoginLabel">Login</p>
            <br /><br />
            <form>
                <input type="text"
                    autoComplete='username'
                    placeholder='Username'
                    id="username"
                    spellCheck="false"
                />
                <br /><br />
                <input
                    type="password"
                    autoComplete='password'
                    placeholder='Password'
                    id="password"
                    spellCheck="false"
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
