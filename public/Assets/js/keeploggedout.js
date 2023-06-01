async function logOut() {
    // Make a request to the logout endpoint on the server
    let logoutData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID: document.cookie.split("=")[1] })
    }
    
    fetch('/logout', logoutData)
        .then(function (response) {
            // Redirect to the login page
            window.location.replace("/User/Authentication/Log-Out");
        });
}

window.onload = function () {
    // POST Request to check if user is logged in
    let checkLoggedIndata;
    if (document.cookie.split("=")[1] != undefined || document.cookie.split("=")[1] != null) {
        checkLoggedIndata = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataID: document.cookie.split("=")[1] })
        }
    } else {
        checkLoggedIndata = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ DataID: null })
        }
    }

    fetch('/checkLoggedIn', checkLoggedIndata)
        .then(function (response) {
            if (!response.status == 200) {
                window.location.href = "/User/Authentication/Log-In";
            }
        });
}