document.addEventListener("DOMContentLoaded", async () => {
    showLoader();

    try {
        const token = localStorage.getItem("token");
        if (!token) return location.href = "index.html";

        const res = await fetch(`${BASE_URL}/product`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch products");

        const products = await res.json();
        allProducts(products);

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }
});

function allProducts(products) {
    const tbody = document.getElementById("productsTableBody");
    tbody.innerHTML = "";

    products.forEach((p, index) => {
        tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${p.name}</td>
                <td>${p.price}</td>
                <td>${p.quantity}</td>
                <td>${p.subCategory?.category?.name || "-"}</td>
                <td>${p.subCategory?.name || "-"}</td>
                <td>${getStatus(p.quantity)}</td>
                <td>
                    <a href="viewProduct.html?id=${p.id}" class="btn btn-sm btn-info">View</a>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id}, this.closest('tr'))">Delete</button>
                </td>
            </tr>
        `;
    });
}

function getStatus(quantity) {
    if (quantity === 0) return `<span class="badge bg-danger">Out of Stock</span>`;
    if (quantity <= 10) return `<span class="badge bg-warning text-dark">Low Stock</span>`;
    return `<span class="badge bg-success">In Stock</span>`;
}

async function deleteProduct(id, row) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    showLoader();
    try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/product/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Delete failed");

        showToast("Product deleted successfully", "success", 3000);
        row.remove();

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }
}
