document.addEventListener("DOMContentLoaded", function () {
    async function waitForUserData() {
        while (!userData) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    (async () => {
        await waitForUserData();
        if (userData.firstName == "" || userData.firstName == undefined || userData.firstName == null) {
            window.location.href = "/User/Authentication/Log-In"
        }
            document.getElementById("NamePlate").innerHTML = "Welcome " + userData.firstName + "!";
        document.getElementById("Loggedinas").innerHTML = "Logged in as " + userData.displayName;
    })();
});