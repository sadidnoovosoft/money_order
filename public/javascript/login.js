document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const objectData = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${baseURL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectData)
        });
        const data = await response.json();
        if (response.ok) {
            window.location.replace("/dashboard");
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        showMessage("error", error.message, "red");
    }
})