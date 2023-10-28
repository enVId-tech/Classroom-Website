import React, { useEffect, useState } from 'react';

const UserSettingsProfile = () => {
    const [userInformation, setUserInformation] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const dataID = await getDataIDFromServer();
                const userData = await getUserDataFromServer(dataID);
                setUserInformation(userData);

                if (window.location.pathname.includes('/settings/')) {
                    const firstNameInput = document.getElementById('firstn');
                    const lastNameInput = document.getElementById('lastn');
                    const emailInput = document.getElementById('email');
                    const usernameInput = document.getElementById('username');

                    firstNameInput.value = userData[0].firstName;
                    lastNameInput.value = userData[0].lastName;
                    emailInput.value = userData[0].email;
                    usernameInput.value = userData[0].email;
                } else if (window.location.pathname.includes('/profile/')) {
                    const profilePicture = document.getElementsByClassName('profilepicture');
                    const displayName = document.getElementsByClassName('display');

                    profilePicture[0].src = userData[0].profilePicture;
                    displayName[0].value = userData[0].displayName;
                }
            } catch (error) {
                console.log('An error occurred:', error);
            }
        };

        fetchData();
    }, []);

    const handleSave = async () => {
        let studentData = {};

        if (window.location.pathname.includes('/settings/')) {
            studentData = {
                username: document.getElementById('username').value,
                password: document.getElementById('password').value,
                passwordconfirm: document.getElementById('passwordconfirm').value,
                URL: window.location.pathname,
            };
        } else if (window.location.pathname.includes('/profile/')) {
            studentData = {
                displayName: document.getElementsByClassName('display')[0].value,
                profilePicture: document.getElementsByClassName('profilepicture')[0].src,
                URL: window.location.pathname,
            };
        }

        const sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(studentData),
        };

        try {
            const response = await fetch('/student/data/update', sendData);
            const data = await response.json();

            if (data.error) {
                setErrorMessage(data.error);
                setTimeout(() => {
                    setErrorMessage('');
                }, 3000);
            }
            if (data.success) {
                setSuccessMessage(data.success);
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        } catch (error) {
            console.log('An error occurred:', error);
        }
    };

    return (
        <div>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
            {successMessage && <p style={{ color: 'lightgreen' }}>{successMessage}</p>}

            <input id="firstn" type="text" />
            <input id="lastn" type="text" />
            <input id="email" type="email" />
            <input id="username" type="text" />

            <button id="Save" onClick={handleSave}>Save</button>
        </div>
    );
};

export default UserSettingsProfile;
