document.getElementById("loginForm").addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    showLoader();

    try {
        const res = await fetch(`${BASE_URL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({email, password})
        });
        if (!res.ok) throw new Error('Invalid credentials, please check your email and password.');
        const data = await res.json();

        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        showToast('Login successful!', 'success', 3000);
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
    } catch (err) {
        showToast(err.message || 'Login failed: ', 'danger', 3000);
    } finally {
        hideLoader();
    }
});