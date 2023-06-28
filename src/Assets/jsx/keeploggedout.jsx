import React, { useEffect } from 'react';

async function logOut() {
  const logoutData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dataID: document.cookie.split("=")[1] })
  };

  try {
    await fetch('/student/data/logout', logoutData);
    if (document.cookie.includes("dataID")) {
      document.cookie = "dataID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    console.log(document.cookie.split("=")[1]);
    window.location.replace("/User/Authentication/Log-Out");
  } catch (error) {
    console.log('An error occurred while logging out:', error);
    // Handle the error - display an error message or perform other actions
  }
}

async function checkLoggedIn(dataIDNumber) {
  let dataID;
  if (!dataIDNumber) {
   dataID = document.cookie.split("=")[1];
  } else {
    dataID = dataIDNumber;
  }
  if (dataID && dataID !== "undefined" && dataID !== "null") {
    const checkLoggedIndata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID: dataID || null })
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
  } else {
    window.location.href = "/User/Authentication/Log-In";
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

export { LoggedOut, logOut, checkLoggedIn };
