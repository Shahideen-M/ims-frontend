document.addEventListener("DOMContentLoaded", async () => {
    showLoader();

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = 'index.html';
            return;
        }
        const res = await fetch(`${BASE_URL}/product/dashboard`, {
            headers: { Authorization: `Bearer ${token}`}
    });
        if (!res.ok) throw new Error('Failed to fetch dashboard');

        const data = await res.json();
        document.getElementById('totalProducts').textContent = data.totalProducts;
        document.getElementById('totalCategories').textContent = data.totalCategories;
        document.getElementById('outOfStock').textContent = data.outOfStock;
        document.getElementById('lowStock').textContent = data.lowStock;
} catch (err) {
        showToast(err.message, 'danger', 3000);
    } finally {
        hideLoader();
    }
});