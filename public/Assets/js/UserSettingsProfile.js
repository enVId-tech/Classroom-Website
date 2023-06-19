window.addEventListener("DOMContentLoaded", async() =>{
    if (window.location.pathname.includes("/settings")) {
        const dataID = document.cookie.split("=")[1].split(";")[0];
        const userInformation = await getUserDataFromServer(dataID);

        const firstName = document.getElementById("firstn");
        const lastName = document.getElementById("lastn");
        const email = document.getElementById("email");
        const username = document.getElementById("username");

        firstName.value = userInformation[0].firstName;
        lastName.value = userInformation[0].lastName;
        email.value = userInformation[0].email;
        username.value = userInformation[0].email;

    } else if (window.location.pathname .includes("/profile")) {

    }

    document.getElementById("Save").addEventListener("click", async() => {
        let studentData = {
            username: document.getElementById("username").value,
            password: document.getElementById("password").value,
            passwordconfirm: document.getElementById("passwordconfirm").value,
            dataIDNum: document.cookie.split("=")[1].split(";")[0]
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
            setTimeout(() => {
                document.getElementById("Error").innerHTML = "";
            }, 3000);
        }
    });
    
});


