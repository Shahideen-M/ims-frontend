const BASE_URL = "http://localhost:8080";
// const BASE_URL = "https://ims-backend-2sru.onrender.com";


// Get token & userId dynamically
const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

// 🟡 Detect page
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("loginForm")) loginUser();
  if (document.getElementById("registerForm")) registerUser();
  if (document.getElementById("product-list")) getAllProducts();
  if (document.getElementById("addProductForm")) setupAddProduct();
  if (document.getElementById("editProductForm")) loadAndEditProduct();
});

// ------------------------------
// LOGIN
// ------------------------------
function loginUser() {
  document.getElementById("loginForm").addEventListener("submit", e => {
    e.preventDefault();
    const creds = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };
    showLoading(true);
    fetch(`${BASE_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(creds)
    })
    .then(res => res.json())
    .then(data => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.id);
      alert("✅ Login successful!");
      window.location.href = "dashboard.html";
    })
    .finally(() => showLoading(false))
    .catch(err => console.error("Login error:", err));
  });
}

// ------------------------------
// REGISTER
// ------------------------------
function registerUser() {
  document.getElementById("registerForm").addEventListener("submit", e => {
    e.preventDefault();
    const user = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    };
    showLoading(true);
    fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    })
    .then(async res => {
      if (res.ok) {
        alert("✅ Registration successful!");
        window.location.href = "/index.html";
      } else {
        const errText = await res.text();
        showLoading(false);
        alert("❌ Registration failed: " + errText);
      }
    })
  });
}

// ------------------------------
// GET ALL PRODUCTS
// ------------------------------
function getAllProducts() {
  showLoading(true);
  fetch(`${BASE_URL}/product/all/${getUserId()}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  .then(res => res.json())
  .then(data => {
    showLoading(false);
    const list = document.getElementById("product-list");
    list.innerHTML = data.map(p => `
      <div class="product">
        <h3>${p.name || "Unnamed"}</h3>
        <p>₹${p.price}</p>
        <p>Qty: ${p.quantity}</p>
        <button onclick="edit(${p.id})">Edit</button>
        <button onclick="del(${p.id})">Delete</button>
      </div>
    `).join("");
  })
  .catch(err => {
    showLoading(false);
    console.error("Error loading products:", err);
  });
}

// ------------------------------
// ADD PRODUCT
// ------------------------------
function setupAddProduct() {
  document.getElementById("addProductForm").addEventListener("submit", e => {
    e.preventDefault();
    const product = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value
    };
    fetch(`${BASE_URL}/product/add/${getUserId()}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
    .then(() => {
      alert("✅ Product added!");
      window.location.href = "dashboard.html";
    })
    .catch(err => console.error(err));
  });
}

// ------------------------------
// DELETE PRODUCT
// ------------------------------
function del(id) {
  if (!confirm("Delete this product?")) return;
  fetch(`${BASE_URL}/product/delete/${getUserId()}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  .then(() => {
    alert("🗑️ Deleted!");
    getAllProducts();
  })
  .catch(err => console.error(err));
}

// ------------------------------
// EDIT PRODUCT
// ------------------------------
function edit(id) {
  window.location.href = `editproduct.html?id=${id}`;
}

function loadAndEditProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  fetch(`${BASE_URL}/product/${id}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  })
  .then(res => res.json())
  .then(p => {
    document.getElementById("id").value = p.id;
    document.getElementById("name").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("quantity").value = p.quantity;
  })
  .catch(err => console.error(err));

  document.getElementById("editProductForm").addEventListener("submit", e => {
    e.preventDefault();
    const product = {
      productId: document.getElementById("id").value,
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value
    };
    fetch(`${BASE_URL}/product/update/${getUserId()}/${product.productId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(product)
    })
    .then(() => {
      alert("✏️ Updated!");
      window.location.href = "dashboard.html";
    })
    .catch(err => console.error(err));
  });
}

// ------------------------------
// LOADING INDICATOR
// ------------------------------
function showLoading(show) {
  const loader = document.getElementById("loading");
  if (loader) loader.style.display = show ? "block" : "none";
}

// ------------------------------
// HELP & PROFILE
// ------------------------------
document.getElementById("help")?.addEventListener("click", () => {
  window.open("https://forms.gle/VfEhm6sQKwHqG1jr5");
});
document.getElementById("profile")?.addEventListener("click", () => {
  alert("Profile is under construction!");
});