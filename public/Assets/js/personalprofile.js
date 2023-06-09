document.addEventListener("DOMContentLoaded", async function () {
    const dataID = await getDataIDFromServer();
    const userInformation = await getUserDataFromServer(dataID);
    setUserInfoValues(userInformation);
    Elements();
});

async function setUserInfoValues(userInformation) {
    const namePlate = document.getElementById("NamePlate");
    if (namePlate && namePlate.innerHTML.includes("!")) {
      namePlate.innerHTML = "Welcome " + userInformation[0].firstName + "!";
    }
    document.getElementById("Loggedinas").innerHTML = "Logged in as " + userInformation[0].displayName;
    document.getElementById("ProfilePicture").src = userInformation[0].profilePicture;
};

async function getDataIDFromServer() {
    const response = await fetch('/student/ID', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    document.cookie = `dataID=${data.newSessionID}`;
    checkLoggedIn();
    return data.newSessionID;
}

async function getUserDataFromServer(dataID) {
    const response = await fetch('/student/data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID })
    });
    return response.json();
}