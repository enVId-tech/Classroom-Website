import React from "react";
import { Helmet } from "react-helmet-async";

const ClassHelmet = ({ page, classType, classPage }) => {
    switch (page) {
        case "login": {
            return (
                <Helmet>
                    <title>CS Pathway - Log In</title>
                    <link rel="shortcut icon" href="/images/LogIn.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "logout": {
            return (
                <Helmet>
                    <title>CS Pathway - Log Out</title>
                    <link rel="shortcut icon" href="/images/LogOut.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "home": {
            return (
                <Helmet>
                    <title>CS Pathway - Home</title>
                    <link rel="shortcut icon" href="/images/HomePage.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "settings": {
            return (
                <Helmet>
                    <title>CS Pathway - Settings</title>
                    <link rel="shortcut icon" href="/images/GearIcon.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "profile": {
            return (
                <Helmet>
                    <title>CS Pathway - Profile</title>
                    <link rel="shortcut icon" href="/images/GearIcon.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "connections": {
            return (
                <Helmet>
                    <title>CS Pathway - Connections</title>
                    <link rel="shortcut icon" href="/images/connectionsLogo.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "viewconnections": {
            return (
                <Helmet>
                    <title>CS Pathway - View Appointments</title>
                    <link rel="shortcut icon" href="/images/connectionsLogo.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "requestconnections": {
            return (
                <Helmet>
                    <title>CS Pathway - Request Appointment</title>
                    <link rel="shortcut icon" href="/images/connectionsLogo.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
        case "class": {
            switch (classPage) {
                case "home": {
                    switch (classType) {
                        case "CSD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Computer Science Discoveries</title>
                                    <link rel="shortcut icon" href="/images/CodeorgLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSP": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - AP Computer Science Principles</title>
                                    <link rel="shortcut icon" href="/images/Javascript.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSA": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - AP Computer Science A</title>
                                    <link rel="shortcut icon" href="/images/JavaLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "MAD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Mobile App Development</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        default: {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Class</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                    }
                }
                case "assignments": {
                    switch (classType) {
                        case "CSD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - CSD Assignments</title>
                                    <link rel="shortcut icon" href="/images/CodeorgLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSP": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSP Assignments</title>
                                    <link rel="shortcut icon" href="/images/Javascript.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSA": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSA Assignments</title>
                                    <link rel="shortcut icon" href="/images/JavaLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "MAD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - MAD Assignments</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        default: {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Assignments</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                    }
                }
                case "announcements": {
                    switch (classType) {
                        case "CSD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - CSD Announcements</title>
                                    <link rel="shortcut icon" href="/images/CodeorgLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSP": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSP Announcements</title>
                                    <link rel="shortcut icon" href="/images/Javascript.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSA": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSA Announcements</title>
                                    <link rel="shortcut icon" href="/images/JavaLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "MAD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - MAD Announcements</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        default: {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Announcements</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                    }
                }
                case "agenda": {
                    switch (classType) {
                        case "CSD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - CSD Agenda</title>
                                    <link rel="shortcut icon" href="/images/CodeorgLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSP": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSP Agenda</title>
                                    <link rel="shortcut icon" href="/images/Javascript.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSA": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSA Agenda</title>
                                    <link rel="shortcut icon" href="/images/JavaLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "MAD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - MAD Agenda</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        default: {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Agenda</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                    }
                }
                case "learninglog": {
                    switch (classType) {
                        case "CSD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - CSD Learning Log</title>
                                    <link rel="shortcut icon" href="/images/CodeorgLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSP": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSP Learning Log</title>
                                    <link rel="shortcut icon" href="/images/Javascript.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "APCSA": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - APCSA Learning Log</title>
                                    <link rel="shortcut icon" href="/images/JavaLogo.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        case "MAD": {
                            return (
                                <Helmet>
                                    <title>CS Pathway - MAD Learning Log</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                        default: {
                            return (
                                <Helmet>
                                    <title>CS Pathway - Learning Log</title>
                                    <link rel="shortcut icon" href="/images/AndroidStudio.png" type="image/x-icon"></link>
                                </Helmet>
                            )
                        }
                    }
                }
                default: break;
            }
        }
        default: {
            return (
                <Helmet>
                    <title>CS Pathway</title>
                    <link rel="shortcut icon" href="/images/HomePage.png" type="image/x-icon"></link>
                </Helmet>
            )
        }
    }
}

export default ClassHelmet;