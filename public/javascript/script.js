const baseURL = 'http://localhost:3000/api';

// helper functions
function showMessage(elementId, message, color) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.color = color;
    element.style.fontSize = "13px";
}

const scrollToBottom = (selector) => {
    const element = document.querySelector(selector);
    element.scrollTop = element.scrollHeight;
}

// get current user
async function getCurrentUser() {
    return (await fetch(`${baseURL}/users/current`)).json();
}