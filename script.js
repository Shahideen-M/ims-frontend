// const BASE_URL = "http://localhost:8080";
const BASE_URL = "https://ims-backend-2sru.onrender.com";

// 🟡 Detect which page we’re on
document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("product-list")) getAllProducts();
  if (document.getElementById("addProductForm")) setupAddProduct();
  if (document.getElementById("editProductForm")) loadAndEditProduct();
});

// 🟢 Fetch and show all products
function getAllProducts() {
  showLoading(true);
  fetch(`${BASE_URL}/product/all`)
    .then(r => r.json())
    .then(d => {
      showLoading(false);
      const list = document.getElementById("product-list");
      list.innerHTML = d.map(p => `
        <div class="product">
          <h3>${p.name || "Unnamed"}</h3>
          <p>₹${p.price}</p>
          <p>Qty: ${p.quantity}</p>
          <button onclick="edit(${p.productId})">Edit</button>
          <button onclick="del(${p.productId})">Delete</button>
        </div>
      `).join("");
    })
    .catch(err => {
      showLoading(false);
      console.error("Error loading products:", err);
    }); 
}

// 🟠 Add product page
function setupAddProduct() {
  document.getElementById("addProductForm").addEventListener("submit", e => {
    e.preventDefault();
    const p = {
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value
    };
    fetch(`${BASE_URL}/product/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    })
      .then(() => alert("✅ Product added!"))
      .then(() => (location.href = "index.html"));
  });
}

// 🔴 Delete product
function del(id) {
  if (confirm("Delete this product?")) {
    fetch(`${BASE_URL}/product/delete/${id}`, { method: "DELETE" })
      .then(() => alert("🗑️ Deleted!"))
      .then(getAllProducts);
  }
}

// 🔵 Go to edit page
function edit(id) {
  location.href = `editproduct.html?id=${id}`;
}

// 🟣 Edit product (load + update)
function loadAndEditProduct() {
  const id = new URLSearchParams(window.location.search).get("id");
  if (!id) return;

  fetch(`${BASE_URL}/product/${id}`)
    .then(r => r.json())
    .then(p => {
      document.getElementById("id").value = p.productId;
      document.getElementById("name").value = p.name;
      document.getElementById("price").value = p.price;
      document.getElementById("quantity").value = p.quantity;
    });

  document.getElementById("editProductForm").addEventListener("submit", e => {
    e.preventDefault();
    const p = {
      productId: document.getElementById("id").value,
      name: document.getElementById("name").value,
      price: document.getElementById("price").value,
      quantity: document.getElementById("quantity").value
    };
    fetch(`${BASE_URL}/product/update/${p.productId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p)
    })
      .then(() => alert("✏️ Updated!"))
      .then(() => (location.href = "index.html"));
  });
}

document.getElementById("help").onclick = function() {
  window.open("https://forms.gle/VfEhm6sQKwHqG1jr5");
}

document.getElementById("profile").onclick = function() {
  alert("Profile is under construction!");

}
// Loading indicator
function showLoading(isLoading) {
  document.getElementById("loading").style.display = isLoading ? "block" : "none";
}