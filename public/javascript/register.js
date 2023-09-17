document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    const objectData = Object.fromEntries(formData.entries());
    if (formData.get('password') !== formData.get('confirm_password')) {
        showMessage("error", "Password should match confirm password", "red");
        return;
    }

    try {
        const data = await callFetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(objectData)
        });
        showMessage("error", data.message, "red");
    } catch (error) {
        showMessage("error", error.message, "red");
    }
})