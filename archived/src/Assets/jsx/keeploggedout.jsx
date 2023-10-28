import React, { useEffect } from 'react';

async function logOut() {
  const logoutData = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  try {
    await fetch('/student/data/logout', logoutData);
    window.location.replace("/User/Authentication/Log-Out");
  } catch (error) {
    console.log('An error occurred while logging out:', error);
    // Handle the error - display an error message or perform other actions
  }
}

async function checkLoggedIn() {

  const checkLoggedIndata = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  };

  try {
    const response = await fetch('/student/data/logout/check', checkLoggedIndata);

    if (response.status !== 200) {
      window.location.href = "/User/Authentication/Log-In";
    }
  } catch (error) {
    console.log('An error occurred while checking login:', error);
    // Handle the error - display an error message or perform other actions
  }
}

function LoggedOut() {
  useEffect(() => {
    (async () => {
      await checkLoggedIn();
    })();
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log('An error occurred while logging out:', error);
      // Handle the error - display an error message or perform other actions
    }
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

async function refreshSessionCookie() {
  const data = await fetch('/student/data/refresh');

  if (data.status !== 200) {
    window.location.href = "/User/Authentication/Log-In";
    //console.log("Session expired");
  } else {
    //console.log("Session refreshed");
  }
}

export { LoggedOut, logOut, checkLoggedIn, refreshSessionCookie };
