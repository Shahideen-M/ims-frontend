document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    const token = localStorage.getItem("token");
    if (!token) return location.href = "index.html";

    const categorySelect = document.getElementById("categorySelect");
    const subCategorySelect = document.getElementById("subCategorySelect");
    const userCategoryWrapper = document.getElementById("userCategoryWrapper");

    // Load global categories
    try {
        const res = await fetch(`${BASE_URL}/category`, { headers: { Authorization: `Bearer ${token}` } });
        const categories = await res.json();

        categorySelect.innerHTML = `<option value="">Select Category</option>`;
        categories.forEach(c => {
            categorySelect.innerHTML += `<option value="${c.id}">${c.name}</option>`;
        });
        categorySelect.innerHTML += `<option value="OTHER">Other</option>`;
    } catch {
        showToast("Failed to load categories", "danger", 3000);
    } finally {
        hideLoader();
    }

    categorySelect.addEventListener("change", async (e) => {
        const catId = e.target.value;

        // Reset subcategory & user category
        subCategorySelect.innerHTML = `<option value="">Select Sub Category</option>`;
        subCategorySelect.disabled = true;
        userCategoryWrapper.innerHTML = "";
        
        if (!catId) return;

        if (catId === "OTHER") {
            // Show user-created categories
            try {
                const res = await fetch(`${BASE_URL}/category/user`, { headers: { Authorization: `Bearer ${token}` } });
                const userCats = await res.json();

                if (userCats.length === 0) {
                    showToast("No custom categories found. Please add one first.", "warning");
                    return;
                }

                let html = `<label class="form-label">Your Categories</label>
                            <select id="userCategorySelect" class="form-select" required>
                                <option value="">Select Your Category</option>`;
                userCats.forEach(c => {
                    html += `<option value="${c.id}">${c.name}</option>`;
                });
                html += `</select>`;
                userCategoryWrapper.innerHTML = html;

            } catch {
                showToast("Failed to load your categories", "danger", 3000);
            }
        } else {
            // Load subcategories for normal category
            try {
                const res = await fetch(`${BASE_URL}/category/${catId}/sub`, { headers: { Authorization: `Bearer ${token}` } });
                const subCats = await res.json();

                subCategorySelect.innerHTML = `<option value="">Select Sub Category</option>`;
                subCats.forEach(sc => {
                    subCategorySelect.innerHTML += `<option value="${sc.id}">${sc.name}</option>`;
                });
                subCategorySelect.disabled = false;

            } catch {
                showToast("Failed to load sub categories", "danger", 3000);
            }
        }
    });

    // Submit product
    document.getElementById("addProductForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        showLoader();
        try {
            const selectedSub = document.getElementById("userCategorySelect") || subCategorySelect;
            const subCatId = selectedSub.value;

            const product = {
                name: document.getElementById("name").value.trim(),
                price: document.getElementById("price").value,
                quantity: document.getElementById("quantity").value,
                description: document.getElementById("description").value,
                shopAddress: document.getElementById("shopAddress").value,
                subCategory: { id: subCatId }
            };

            const res = await fetch(`${BASE_URL}/product/${subCatId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
});
