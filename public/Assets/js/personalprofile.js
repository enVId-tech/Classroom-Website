let userData;

document.addEventListener("DOMContentLoaded", async function () {
    const dataID = await getDataIDFromServer();
    userData = await getUserDataFromServer(dataID);
    Elements();
});

async function getDataIDFromServer() {
    const response = await fetch('/api/GetMain', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    document.cookie = `dataID=${data.newSessionID}`;
    return data.newSessionID;
}

async function getUserDataFromServer(dataID) {
    const response = await fetch('/getData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ dataID })
    });
    return response.json();
}
