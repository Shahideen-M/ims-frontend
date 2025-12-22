document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const res = await fetch(`${BASE_URL}/category`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const categories = await res.json();
        const categorySelect = document.getElementById("categorySelect");

        categories.forEach(c => {
            categorySelect.innerHTML += `
                <option value="${c.id}">${c.name}</option>
            `;
        });

    } catch {
        showToast("Failed to load categories", "danger", 3000);
    } finally {
        hideLoader();
    }
});

document.getElementById("categorySelect").addEventListener("change", async (e) => {
    const categoryId = e.target.value;
    const subSelect = document.getElementById("subCategorySelect");

    subSelect.innerHTML = `<option value="">Select Sub Category</option>`;
    subSelect.disabled = true;

    if (!categoryId) return;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${BASE_URL}/category/${categoryId}/sub`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        const subCategories = await res.json();

        subCategories.forEach(sc => {
            subSelect.innerHTML += `
                <option value="${sc.id}">${sc.name}</option>
            `;
        });

        subSelect.disabled = false;

    } catch {
        showToast("Failed to load sub categories", "danger", 3000);
    }
});

// Submit product
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    try {
        const token = localStorage.getItem("token");

        const product = {
            name: document.getElementById("name").value.trim(),
            price: document.getElementById("price").value,
            quantity: document.getElementById("quantity").value,
            description: document.getElementById("description").value,
            shopAddress: document.getElementById("shopAddress").value,
            subCategoryId: document.getElementById("subCategorySelect").value
        };

        const res = await fetch(`${BASE_URL}/product/${product.subCategoryId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(product)
        });

        if (!res.ok) throw new Error("Failed to add product");

        showToast("Product added successfully", "success", 3000);
        setTimeout(() => window.location.href = "products.html", 1200);

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }
});
