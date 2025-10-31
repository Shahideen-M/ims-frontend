document.addEventListener("DOMContentLoaded", fetchProducts);

function fetchProducts() {
  fetch("https://ims-backend-2sru.onrender.com/product/all")
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
    fetch(`https://ims-backend-2sru.onrender.com/product/delete/${id}`, { method: "DELETE" })
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

      fetch("https://ims-backend-2sru.onrender.com/product/add", {
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

      const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get("id");

    fetch(`https://ims-backend-2sru.onrender.com/product/${id}`)
      .then(res => res.json())
      .then(p => {
        document.getElementById("id").value = p.id;
        document.getElementById("name").value = p.name;
        document.getElementById("price").value = p.price;
        document.getElementById("quantity").value = p.quantity;
      });

    document.getElementById("editProductForm").addEventListener("submit", (e) => {
      e.preventDefault();

      const product = {
        id: document.getElementById("id").value,
        name: document.getElementById("name").value,
        price: document.getElementById("price").value,
        quantity: document.getElementById("quantity").value,
      };

      fetch(`https://ims-backend-2sru.onrender.com/product/update/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      })
        .then(res => res.text())
        .then(msg => {
          alert("Product updated successfully!");
          window.location.href = "index.html";
        })
        .catch(() => alert("Update failed"));
    });