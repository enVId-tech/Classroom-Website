window.addEventListener("DOMContentLoaded", async () => {
    const dataID = await getDataIDFromServer();
    const userInformation = await getUserDataFromServer(dataID);

    if (window.location.pathname.includes("/settings/")) {
        const firstName = document.getElementById("firstn");
        const lastName = document.getElementById("lastn");
        const email = document.getElementById("email");
        const username = document.getElementById("username");

        firstName.value = userInformation[0].firstName;
        lastName.value = userInformation[0].lastName;
        email.value = userInformation[0].email;
        username.value = userInformation[0].email;

    } else if (window.location.pathname.includes("/profile/")) {
        const profilePicture = document.getElementsByClassName("profilepicture");
        const displayName = document.getElementsByClassName("display");

        profilePicture[0].src = userInformation[0].profilePicture;
        displayName[0].value = userInformation[0].displayName;
    }

    document.getElementById("Save").addEventListener("click", async () => {
        
        let studentData;
        if (window.location.pathname.includes("/settings/")) {
            studentData = {
                username: document.getElementById("username").value,
                password: document.getElementById("password").value,
                passwordconfirm: document.getElementById("passwordconfirm").value,
                dataIDNum: document.cookie.split("=")[1].split(";")[0],
                URL: window.location.pathname
            }
        } else if (window.location.pathname.includes("/profile/")) {
            studentData = {
                displayName: document.getElementsByClassName("display")[0].value,
                profilePicture: document.getElementsByClassName("profilepicture")[0].src,
                dataIDNum: document.cookie.split("=")[1].split(";")[0],
                URL: window.location.pathname
            }
        }
        const sendData = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        }

        const response = await fetch('/student/data/update', sendData);
        const data = await response.json();

        if (data.error) {
            document.getElementById("Error").innerHTML = data.error;
            document.getElementById("Error").style.color = "red";
            setTimeout(() => {
                document.getElementById("Error").innerHTML = "";
                document.getElementById("Error").style.color = "white";
            }, 3000);
        }
        if (data.success) {
            document.getElementById("Error").innerHTML = data.success;
            document.getElementById("Error").style.color = "lightgreen";
            setTimeout(() => {
                document.getElementById("Error").innerHTML = "";
                document.getElementById("Error").style.color = "white";
            }, 3000);
        }
    });

});


