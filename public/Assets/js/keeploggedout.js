async function logOut() {
    // Make a request to the logout endpoint on the server
    fetch('/logout')
        .then(function (response) {
            // Redirect to the login page
            window.location.replace("/User/Authentication/Log-Out");
        });
}

window.onload = function () {
    fetch('/checkLoggedIn')
        .then(function (response) {
            if (response.status == 200) {
                // User is logged in
            } else {
                window.location.href = "/User/Authentication/Log-In";
            }
        });
}