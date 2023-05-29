window.onload = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    usernameInput.addEventListener('focus', function () {
        if (!this.value.trim()) {
            this.placeholder = '';
            this.parentElement.classList.add('placeholder-move-up');
        }
    });

    usernameInput.addEventListener('blur', function () {
        if (!this.value.trim()) {
            this.placeholder = 'Username';
            this.parentElement.classList.remove('placeholder-move-up');
        }
    });

    passwordInput.addEventListener('focus', function () {
        if (!this.value.trim()) {
            this.placeholder = '';
            this.parentElement.classList.add('placeholder-move-up');
        }
    });

    passwordInput.addEventListener('blur', function () {
        if (!this.value.trim()) {
            this.placeholder = 'Password';
            this.parentElement.classList.remove('placeholder-move-up');
        }
    });
}


function LogCheck() {
    let usernameInput = document.getElementById('username');
    let passwordInput = document.getElementById('password');

    if (usernameInput.value == "") {
        usernameInput.style.borderBottomColor = "red";
    }
    if (passwordInput.value == "") {
        passwordInput.style.borderBottomColor = "red";
    }

    if (usernameInput.value != "" && passwordInput.value != "") {
        if (usernameInput.value == "Erick Tran" && passwordInput.value == "admin") {
            window.location.href = "/";
        }
        if (usernameInput.value.indexOf("student.auhsd.us") != -1 && passwordInput.value != "") {
            window.location.href = "/";
        }
    }
}
