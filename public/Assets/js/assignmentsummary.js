window.addEventListener('DOMContentLoaded', async function () {
    AssignmentsGet();
});

async function AssignmentsGet() {
    const url = window.location.pathname;
    const dataID = document.cookie.split("=")[1].split(";")[0];

    const fetchData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url, dataID: dataID }),
    }

    await fetch('/student/assignments/summary/get', fetchData)
        .then(response => response.json())
        .then(data => {
            console.log(data);
        }
    );
};