import React from 'react';
import LogCheck from '../Assets/jsx/login.jsx';
import { HelmetProvider } from "react-helmet-async";
import ClassHelmet from '../Assets/jsx/pagehead.jsx';

const Login = () => {
    return (
        <HelmetProvider>
            <ClassHelmet page="login" />
            <div>
                <center>
                    <LogCheck />
                </center>
            </div>
        </HelmetProvider>
    );
};

export default Login;
