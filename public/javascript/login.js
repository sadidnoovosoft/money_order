document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    try {
        const response = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        });
        const data = await response.json();
        if (response.ok) {
            window.location.replace("/dashboard");
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        handleError(error.message);
    }
})