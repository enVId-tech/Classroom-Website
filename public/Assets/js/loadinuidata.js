document.addEventListener("DOMContentLoaded", function () {
    async function waitForUserData() {
        while (!userData) {
            await new Promise((resolve) => setTimeout(resolve, 500));
        }
    }

    (async () => {
        await waitForUserData();
        /*
        if (userData.firstName == "" || userData.firstName == undefined || userData.firstName == null) {
            //window.location.href = "/User/Authentication/Log-In"
            if (document.cookie) {
                document.cookie = "dataID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            }
        }*/

        if (document.getElementById("NamePlate")) {
            if (document.getElementById("NamePlate").innerHTML.includes("!")) {
                document.getElementById("NamePlate").innerHTML = "Welcome " + userData.firstName + "!";
            }
        }
        document.getElementById("Loggedinas").innerHTML = "Logged in as " + userData.displayName;
        document.getElementById("ProfilePicture").src = userData.profilePicture;
    })();
});