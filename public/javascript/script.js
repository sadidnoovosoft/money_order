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

// Make api call
async function callFetch(apiURI, options) {
    const response = await fetch(apiURI, options);
    if (!response.ok) {
        if (window.location.pathname !== "/login.html") {
            window.location.replace("/login.html");
        }
        return;
    }
    return await response.json();
}

window.onload = async function () {
    const currentUser = await getCurrentUser();
    const login = document.getElementById("login");
    if (!currentUser.username) {
        login.href = "/login.html";
        login.innerText = "Login";
        return;
    }
    login.href = `${baseURL}/auth/logout`;
    login.innerText = "Sign out"
}
