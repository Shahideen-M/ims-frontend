document.addEventListener("DOMContentLoaded", fetchProducts);

function fetchProducts() {
  fetch("http://localhost:8080/product/all")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("product-list");
      list.innerHTML = data.map(p => `
        <div class="product">
          <h3>${p.name}</h3>
          <p>Price: ₹${p.price}</p>
          <p>Qty: ${p.quantity}</p>
          <button onclick="editProduct(${p.id})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      `).join("");
    });
}

function editProduct(id) {
  window.location.href = `editproduct.html?id=${id}`;
}

function deleteProduct(id) {
  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`http://localhost:8080/product/delete/${id}`, { method: "DELETE" })
      .then(() => {
        alert("Product deleted!");
        fetchProducts();
      });
  }
}


document.getElementById("addProductForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const product = {
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
      };

      fetch("http://localhost:8080/product/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
        .then(res => res.text())
        .then(msg => {
          alert("Product added successfully!");
          window.location.href = "index.html";
        })
        .catch(() => alert("Failed to add product"));
      });