const nameInput = document.getElementById('name');
const passInput = document.getElementById('pass');
const btn = document.getElementById('signIn-btn');

const inputValidation = () => {
    const nameVal = nameInput.value;
    const passVal = passInput.value;
    
    const defaultName = 'admin';
    const defaultPass = 'admin123';
    if(nameVal === '' && passVal === '') {
        alert('Please fill in both Username and Password!');
        return;
    } else if(nameVal !== defaultName) {
        alert("Incorrect Username! Please check again.");
        return;
    } else if (passVal !== defaultPass) {
        alert("Incorrect Password! Please check again.");
        return;
    } else {
        alert('Welcome Admin.')
        nameInput.value = ''
        passInput.value = ''
        window.location.href = './home.html';
    }

}

btn.addEventListener('click', inputValidation);

window.addEventListener('keypress', function(dets) {
    if(dets.key === 'Enter') {
        inputValidation();
    }
});
