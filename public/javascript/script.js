const baseURL = 'http://localhost:3000/api';

// helper functions
function handleError(message) {
    const error = document.getElementById("error");
    error.textContent = message;
    error.style.color = "red"
    error.style.fontSize = "14px";
}