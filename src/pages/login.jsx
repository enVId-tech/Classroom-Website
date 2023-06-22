import React from 'react';
import LogCheck from '../Assets/js/login.js';

const Login = () => {
    return (
        <div>
            <center>
                <div className="LoginContainer">
                    <span id="BackgroundImage">
                        <br /><br /><br />
                        <h1 id="CopyrightedMaterial">© MrWai.com</h1>
                    </span>
                    <p id="LoginLabel">Login</p>
                    <br /><br />
                    <input type="text" placeholder="Username" id="username" spellCheck="false" />
                    <br /><br />
                    <input type="password" placeholder="Password" id="password" spellCheck="false" />
                    <br /><br />
                    <h1 id="Error"></h1>
                    <button onClick={() => {LogCheck()}} id="LoginButton">Login</button>
                    <br /><br />
                    <a href="/auth/google" className="googlesignin">
                        <span className="fa fa-google"></span>Register/Sign In with Google
                    </a>
                </div>
            </center>
        </div>
    );
};

export default Login;
