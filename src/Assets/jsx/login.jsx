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
        <div className='LoginContainer'>
            <span id="BackgroundImage">
                <br /><br /><br />
                <h1 id="CopyrightedMaterial">© MrWai.com</h1>
            </span>
            <p id="LoginLabel">Login</p>
            <br/><br />
            <input type="text" placeholder='Username' id="username" spellCheck="false" onChange={handleUsernameChange} />
            <br/><br />
            <input type="password" placeholder='Password' id="password" spellCheck="false" onChange={handlePasswordChange} />
            <br/><br />
            <h1 id="Error">{error}</h1>
            <button type="submit" id="LoginButton" onClick={handleSubmit}>Login</button>
            <br/><br />
            <a href="/auth/google" class="googlesignin"><span ckass="fa fa-google" />Register/Sign In with Google</a>
        </div>
        
    //    <div>
    //        {error && <p>{error}</p>}
    //        <form onSubmit={handleSubmit}>
    //            <input type="text" value={username} onChange={handleUsernameChange} placeholder="Username" />
    //            <input type="password" value={password} onChange={handlePasswordChange} placeholder="Password" />
    //            <button type="submit">Log In</button>
    //        </form>
    //    </div>
    );
};

export default LogCheck;
