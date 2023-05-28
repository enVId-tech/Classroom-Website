const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');

usernameInput.addEventListener('focus', function() {
    if (!this.value.trim()) {
        this.placeholder = '';
        this.parentElement.classList.add('placeholder-move-up');
    }
});

usernameInput.addEventListener('blur', function() {
    if (!this.value.trim()) {
        this.placeholder = 'Username';
        this.parentElement.classList.remove('placeholder-move-up');
    }
});

passwordInput.addEventListener('focus', function() {
    if (!this.value.trim()) {
        this.placeholder = '';
        this.parentElement.classList.add('placeholder-move-up');
    }
});

passwordInput.addEventListener('blur', function() {
    if (!this.value.trim()) {
        this.placeholder = 'Password';
        this.parentElement.classList.remove('placeholder-move-up');
    }
});
