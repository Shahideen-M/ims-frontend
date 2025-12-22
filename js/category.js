let modal;
let mode = "add"; // add | edit | delete

document.addEventListener("DOMContentLoaded", () => {
  modal = new bootstrap.Modal(document.getElementById("categoryModal"));
  loadCategories();
});

/* ================= LOAD ================= */

async function loadCategories() {
  showLoader();
  try {
    const token = localStorage.getItem("token");
    if (!token) return location.href = "index.html";

    const res = await fetch(`${BASE_URL}/category/user`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch categories");

    const data = await res.json();
    renderCategories(data);
  } catch (err) {
    showToast(err.message, "danger", 3000);
  } finally {
    hideLoader();
  }
}

function renderCategories(categories) {
  const tbody = document.getElementById("categoriesTableBody");
  tbody.innerHTML = "";

  categories.forEach((c, i) => {
    tbody.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.name}</td>
        <td>
          <button class="btn btn-sm btn-warning me-1" onclick="openEditModal(${c.id}, '${c.name}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="openDeleteModal(${c.id}, '${c.name}')">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ================= MODAL OPENERS ================= */

function openAddModal() {
  mode = "add";
  document.getElementById("modalTitle").textContent = "Add Category";
  document.getElementById("categoryId").value = "";
  document.getElementById("categoryName").value = "";
  document.getElementById("categoryName").disabled = false;
  document.getElementById("modalSaveBtn").textContent = "Save";
  modal.show();
}

function openEditModal(id, name) {
  mode = "edit";
  document.getElementById("modalTitle").textContent = "Edit Category";
  document.getElementById("categoryId").value = id;
  document.getElementById("categoryName").value = name;
  document.getElementById("categoryName").disabled = false;
  document.getElementById("modalSaveBtn").textContent = "Update";
  modal.show();
}

function openDeleteModal(id, name) {
  mode = "delete";
  document.getElementById("modalTitle").textContent = "Delete Category";
  document.getElementById("categoryId").value = id;
  document.getElementById("categoryName").value = name;
  document.getElementById("categoryName").disabled = true;
  document.getElementById("modalSaveBtn").textContent = "Delete";
  modal.show();
}

/* ================= SAVE / UPDATE / DELETE ================= */

async function saveCategory() {
  const token = localStorage.getItem("token");
  const id = document.getElementById("categoryId").value;
  const name = document.getElementById("categoryName").value.trim();

  if ((mode === "add" || mode === "edit") && !name) {
    showToast("Category name required", "warning", 2000);
    return;
  }

  showLoader();
  try {
    let url = `${BASE_URL}/category`;
    let method = "POST";
    let body = { name };

    if (mode === "edit") {
      url = `${BASE_URL}/category/${id}`;
      method = "PUT";
    }

    if (mode === "delete") {
      url = `${BASE_URL}/category/${id}`;
      method = "DELETE";
      body = null;
    }

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body && { "Content-Type": "application/json" })
      },
      ...(body && { body: JSON.stringify(body) })
    });

    if (!res.ok) throw new Error("Operation failed");

    showToast(
      mode === "add" ? "Category added"
      : mode === "edit" ? "Category updated"
      : "Category deleted",
      "success",
      2500
    );

    modal.hide();
    loadCategories();

  } catch (err) {
    showToast(err.message, "danger", 3000);
  } finally {
    hideLoader();
  }
}
