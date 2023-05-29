let userData;
document.addEventListener("DOMContentLoaded", function () {
    async function dataGet() {
        let getData = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await fetch('/api/GetMain', getData)
            .then(response => response.json())
            .then(data => {
                data = data;
                document.cookie = "dataID=" + data.newSessionID;
                getUserDataFromServer();
            });
    }
    dataGet();

    async function getUserDataFromServer() {
        let dataID = document.cookie.split("=")[1];
        let getData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ dataID })
        }
        await fetch('/getData', getData)
            .then(response => response.json())
            .then(data => {
                userData = data;
                console.log(userData);
            });
    }
});