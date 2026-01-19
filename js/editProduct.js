document.addEventListener("DOMContentLoaded", async () => {
    showLoader();
    const token = localStorage.getItem("token");
    if (!token) return location.href = "index.html";

    const params = new URLSearchParams(window.location.search);
    const productId = params.get("id");

    const categorySelect = document.getElementById("category");
    const subcategorySelect = document.getElementById("subcategory");
    const userCategoryWrapper = document.getElementById("userCategoryWrapper");

    const nameInput = document.getElementById("name");
    const priceInput = document.getElementById("price");
    const quantityInput = document.getElementById("quantity");
    const descriptionInput = document.getElementById("description");
    const shopAddressInput = document.getElementById("shopAddress");

    try {
        const res = await fetch(`${BASE_URL}/product/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
        const product = await res.json();

        nameInput.value = product.name;
        priceInput.value = product.price;
        quantityInput.value = product.quantity;
        descriptionInput.value = product.description || "";
        shopAddressInput.value = product.shopAddress || "";

        await loadCategories(product.subCategory.category.id, product.subCategory.id);

    } catch (err) {
        showToast(err.message, "danger", 3000);
    } finally {
        hideLoader();
    }

    categorySelect.addEventListener("change", onCategoryChange);
    document.getElementById("editProductForm").addEventListener("submit", updateProduct);

    // ---------------- Load global categories ----------------
    async function loadCategories(selectedCatId, selectedSubId) {
        const res = await fetch(`${BASE_URL}/category`, { headers: { Authorization: `Bearer ${token}` } });
        const categories = await res.json();

        categorySelect.innerHTML = `<option value="">Select Category</option>`;
        categories.forEach(c => {
            categorySelect.innerHTML += `<option value="${c.id}" ${c.id === selectedCatId ? "selected" : ""}>${c.name}</option>`;
        });
        categorySelect.innerHTML += `<option value="OTHER">Other</option>`;

        // Load subcategories only if not "Other"
        if (categorySelect.value !== "OTHER") {
            await loadSubcategories(selectedCatId, selectedSubId);
        }
    }

    // ---------------- Load subcategories ----------------
    async function loadSubcategories(catId, selectedSubId) {
        if (!catId) return;
        const res = await fetch(`${BASE_URL}/category/${catId}/sub`, { headers: { Authorization: `Bearer ${token}` } });
        const subs = await res.json();

        subcategorySelect.innerHTML = `<option value="">Select Sub Category</option>`;
        subs.forEach(s => subcategorySelect.innerHTML += `<option value="${s.id}" ${s.id === selectedSubId ? "selected" : ""}>${s.name}</option>`);
        subcategorySelect.disabled = false;
        subcategorySelect.style.display = "block";

        userCategoryWrapper.innerHTML = ""; // hide user category
    }

    // ---------------- Handle category change ----------------
    async function onCategoryChange() {
        if (categorySelect.value === "OTHER") {
            subcategorySelect.disabled = true;
            subcategorySelect.style.display = "none";
            subcategorySelect.innerHTML = "";

            try {
                const res = await fetch(`${BASE_URL}/category/user`, { headers: { Authorization: `Bearer ${token}` } });
                const userCats = await res.json();
                if (userCats.length === 0) return showToast("No custom categories found. Please add one first.", "warning");

                let html = `<label class="form-label">Your Categories</label>
                            <select id="userCategorySelect" class="form-select" required>
                                <option value="">Select Your Category</option>`;
                userCats.forEach(c => html += `<option value="${c.id}">${c.name}</option>`);
                html += `</select>`;
                userCategoryWrapper.innerHTML = html;

            } catch {
                showToast("Failed to load your categories", "danger", 3000);
            }
        } else {
            // reset user category wrapper
            userCategoryWrapper.innerHTML = "";
            subcategorySelect.style.display = "block";
            await loadSubcategories(categorySelect.value);
        }
    }

    // ---------------- Update product ----------------
    async function updateProduct(e) {
        e.preventDefault();
        showLoader();
        try {
            // If "Other" is selected, use userCategorySelect; else use normal subcategory
            const selectedSub = document.getElementById("userCategorySelect") || subcategorySelect;
            const subCatId = selectedSub.value;

            if (!subCatId) throw new Error("Please select a subcategory");

            const payload = {
                name: nameInput.value,
                price: priceInput.value,
                quantity: quantityInput.value,
                description: descriptionInput.value || "",
                shopAddress: shopAddressInput.value || "",
                subCategory: { id: subCatId }
            };

            const res = await fetch(`${BASE_URL}/product/${productId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error("Update failed");
            showToast("Product updated successfully", "success", 3000);
            setTimeout(() => location.href = "products.html", 1000);
        } catch (err) {
            showToast(err.message, "danger", 3000);
        } finally {
            hideLoader();
        }
    }
});
