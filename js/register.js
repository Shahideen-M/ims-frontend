document.getElementById("registerForm").addEventListener("submit", async e => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if(!document.getElementById("termscheck").checked) {
        showToast('Please accept the terms and conditions', 'danger', 3000);
        return;
    }

    showLoader();
    try {
        const res = await fetch(`${BASE_URL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({username, email, password})
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        showToast('Registration successful!', 'success', 3000);
        setTimeout(() => window.location.href = 'index.html', 1500);
    } catch (err) {
        showToast(err.message || 'Registration failed: ', 'danger', 3000);
    } finally {
        hideLoader();
    }
});