export default async function LogCheck() {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    if (usernameInput.value === "") {
        usernameInput.style.borderBottomColor = "red";
    }
    if (passwordInput.value === "") {
        passwordInput.style.borderBottomColor = "red";
    }

    const data = {
        username: usernameInput.value,
        password: passwordInput.value
    }

    const sendData = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    const response = await fetch('/student/data/login', sendData);
    const res = await response.json();
    if (res.error) {
        document.getElementById("Error").innerHTML = res.error;
        setTimeout(() => {
            document.getElementById("Error").innerHTML = "";
        }, 3000);
    }
    if (res.success) {
        window.location.href = "/";
    }
}