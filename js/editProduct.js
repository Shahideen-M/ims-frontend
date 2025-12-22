document.addEventListener("DOMContentLoaded", async () => {
  showLoader();

  const token = localStorage.getItem("token");
  if (!token) return location.href = "index.html";

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const nameInput = document.getElementById("name");
  const priceInput = document.getElementById("price");
  const quantityInput = document.getElementById("quantity");
  const descriptionInput = document.getElementById("description");
  const shopAddressInput = document.getElementById("shopAddress");
  const categorySelect = document.getElementById("category");
  const subcategorySelect = document.getElementById("subcategory");
  const form = document.getElementById("editProductForm");

  try {
    const res = await fetch(`${BASE_URL}/product/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to load product");

    const p = await res.json();

    nameInput.value = p.name || "";
    priceInput.value = p.price || "";
    quantityInput.value = p.quantity || "";
    descriptionInput.value = p.description || "";
    shopAddressInput.value = p.shopAddress || "";

    await loadCategories(p.subCategory?.category?.id);
    await loadSubcategories(p.subCategory?.category?.id, p.subCategory?.id);

  } catch (err) {
    showToast(err.message, "danger", 3000);
  } finally {
    hideLoader();
  }

  categorySelect.addEventListener("change", () => {
    loadSubcategories(categorySelect.value);
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoader();

    try {
      const res = await fetch(`${BASE_URL}/product/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: nameInput.value,
          price: priceInput.value,
          quantity: quantityInput.value,
          description: descriptionInput.value || "",
          shopAddress: shopAddressInput.value || "",
          subCategory: {id: subcategorySelect.value}
        })
      });

      if (!res.ok) throw new Error("Update failed");

      showToast("Product updated successfully", "success", 3000);
      setTimeout(() => location.href = "products.html", 1000);

    } catch (err) {
      showToast(err.message, "danger", 3000);
    } finally {
      hideLoader();
    }
  });
});

async function loadCategories(selectedId) {
  const token = localStorage.getItem("token");
  const categorySelect = document.getElementById("category");

  const res = await fetch(`${BASE_URL}/category`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  let html = `<option value="">Select</option>`;
  data.forEach(c => {
    html += `<option value="${c.id}" ${c.id === selectedId ? "selected" : ""}>${c.name}</option>`;
  });
  categorySelect.innerHTML = html;
}

async function loadSubcategories(categoryId, selectedSubId) {
  if (!categoryId) return;

  const token = localStorage.getItem("token");
  const subcategorySelect = document.getElementById("subcategory");

  const res = await fetch(`${BASE_URL}/category/${categoryId}/sub`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();

  let html = `<option value="">Select</option>`;
  data.forEach(sc => {
    html += `<option value="${sc.id}" ${sc.id === selectedSubId ? "selected" : ""}>${sc.name}</option>`;
  });
  subcategorySelect.innerHTML = html;
}
