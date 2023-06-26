import React, { useEffect } from 'react';

async function logOut() {
  const logoutData = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ dataID: document.cookie.split("=")[1] })
  };

  await fetch('/student/data/logout', logoutData);
  if (document.cookie.includes("dataID")) {
    document.cookie = "dataID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  window.location.replace("/User/Authentication/Log-Out");
}

async function checkLoggedIn() {
  const dataID = document.cookie.split("=")[1];
  if (dataID || dataID !== "undefined" || dataID !== "null") {
    const checkLoggedIndata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID: dataID || null })
    };

    const response = await fetch('/student/data/logout/check', checkLoggedIndata);

    if (response.status !== 200) {
      window.location.href = "/User/Authentication/Log-In";
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
    await logOut();
  };

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}

export { LoggedOut, logOut, checkLoggedIn };