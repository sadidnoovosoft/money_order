const baseURL = 'http://localhost:3000/api';

// helper functions
function handleError(message) {
    const error = document.getElementById("error");
    error.textContent = message;
    error.style.color = "red"
    error.style.fontSize = "14px";
}

const scrollToBottom = (id) => {
    const element = document.getElementById(id);
    element.scrollTop = element.scrollHeight;
}

// get current user
async function getCurrentUser() {
    return (await fetch(`${baseURL}/users/current`)).json();
}