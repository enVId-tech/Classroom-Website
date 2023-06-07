async function logOut() {
    // Make a request to the logout endpoint on the server
    const logoutData = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ dataID: document.cookie.split("=")[1] })
    };
  
    await fetch('/logout', logoutData);
  
    // Redirect to the login page
    //window.location.replace("/User/Authentication/Log-Out");
  }
  
  // Check if the user is logged in
  (async function () {
    const dataID = document.cookie.split("=")[1];
    const checkLoggedIndata = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ DataID: dataID || null })
    };
  
    const response = await fetch('/checkLoggedIn', checkLoggedIndata);
  
    if (response.status !== 200) {
      //window.location.href = "/User/Authentication/Log-In";
    }
  })();
  