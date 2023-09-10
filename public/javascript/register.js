document.getElementById("register-form").addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(this);
    if (formData.get('password') !== formData.get('confirm_password')) {
        handleError('Password should match confirm password');
        return;
    }

    try {
        const response = await fetch(`${baseURL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(formData)
        });
        const data = await response.json();
        if (response.ok) {
            window.location.replace("/login.html");
        } else {
            throw new Error(data.message);
        }
    } catch (error) {
        handleError(error.message);
    }
})