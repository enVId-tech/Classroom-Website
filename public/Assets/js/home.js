document.addEventListener("DOMContentLoaded", function () {
    async function waitForUserData() {
        while (!userData) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }
    }

    (async () => {
        await waitForUserData();
        document.getElementById("NamePlate").innerHTML = "Welcome " + userData.firstName + "!";
        document.getElementById("Loggedinas").innerHTML = "Logged in as " + userData.displayName;
    })();
});