document.addEventListener("DOMContentLoaded", async () => {
    showLoader();

    try {
        const token = localStorage.getItem("token");
        if (!token) {
            window.location.href = "index.html";
            return;
        }

        const params = new URLSearchParams(window.location.search);
        const productId = params.get("id");

        if (!productId) throw new Error("Product ID missing");

        const res = await fetch(`${BASE_URL}/product/${productId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch product");

        const p = await res.json();
        displayProduct(p);

        // Move delete listener here so it can access productId
        document.getElementById("deleteBtn").addEventListener("click", async () => {
            if (!confirm("Are you sure you want to delete this product?")) return;

            showLoader();
            try {
                const resDel = await fetch(`${BASE_URL}/product/${productId}`, {
                    method: "DELETE",
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (!resDel.ok) throw new Error("Delete failed");

                showToast("Product deleted successfully", "success", 3000);
                setTimeout(() => location.href = "products.html", 1000);

            } catch (err) {
                showToast(err.message, "danger", 3000);
            } finally {
                hideLoader();
            }
        });

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }
});

function displayProduct(p) {
    document.getElementById("productName").textContent = p.name;
    document.getElementById("price").textContent = p.price;
    document.getElementById("quantity").textContent = p.quantity;
    document.getElementById("status").innerHTML = getStatus(p.quantity);

    document.getElementById("category").textContent =
        p.subCategory?.category?.name || "-";

    document.getElementById("subCategory").textContent =
        p.subCategory?.name || "-";

    document.getElementById("description").textContent =
        p.description || "-";

    document.getElementById("shopAddress").textContent =
        p.shopAddress || "-";

    document.getElementById("editBtn").href =
        `editProduct.html?id=${p.id}`;
}

function getStatus(quantity) {
    if (quantity === 0)
        return `<span class="badge bg-danger">Out of Stock</span>`;
    if (quantity <= 10)
        return `<span class="badge bg-warning text-dark">Low Stock</span>`;
    return `<span class="badge bg-success">In Stock</span>`;
}
