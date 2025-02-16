import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCPgo2oYlLinN8_rtXdzADEXyEo1ByZwq0",
    authDomain: "product-details-3511d.firebaseapp.com",
    projectId: "product-details-3511d",
    storageBucket: "product-details-3511d.firebasestorage.app",
    messagingSenderId: "471810249546",
    appId: "1:471810249546:web:d298cdb40650181b09a7b3",
    measurementId: "G-1Q73VN0H1K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productRef = ref(db, "products");

// Add Product
document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const details = document.getElementById("productDetails").value;
    const price = document.getElementById("productPrice").value;

    if (name && details && price) {
        const newProduct = push(productRef);
        set(newProduct, { name, details, price });
        this.reset();
        bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
    }
});

// Load Products
function loadProducts() {
    onValue(productRef, (snapshot) => {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            const key = childSnapshot.key;

            const li = document.createElement("li");
            li.className = "list-group-item";
            li.dataset.id = key;
            li.innerHTML = `
                <strong>${product.name}</strong><br>
                <span class="details">${product.details}</span><br>
                <span class="price">Price: Rs:${product.price}</span><br>
                <button class="btn btn-warning btn-sm edit-btn">Edit</button>
                <button class="btn btn-danger btn-sm delete-btn">Delete</button>
            `;
            productList.appendChild(li);
        });
    });
}

// Edit Product
document.getElementById("productList").addEventListener("click", function(event) {
    if (event.target.classList.contains("edit-btn")) {
        let listItem = event.target.closest("li");
        document.getElementById("updateProductId").value = listItem.dataset.id;
        document.getElementById("updateProductName").value = listItem.querySelector("strong").textContent;
        document.getElementById("updateProductDetails").value = listItem.querySelector(".details").textContent;
        document.getElementById("updateProductPrice").value = listItem.querySelector(".price").textContent.replace("Price: Rs:", "");

        new bootstrap.Modal(document.getElementById("updateProductModal")).show();
    }
});

// Update Product
document.getElementById("updateProductForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const key = document.getElementById("updateProductId").value;
    const name = document.getElementById("updateProductName").value;
    const details = document.getElementById("updateProductDetails").value;
    const price = document.getElementById("updateProductPrice").value;

    if (key && name && details && price) {
        update(ref(db, `products/${key}`), { name, details, price });
        bootstrap.Modal.getInstance(document.getElementById("updateProductModal")).hide();
    }
});

// Delete Product
document.getElementById("productList").addEventListener("click", function(event) {
    if (event.target.classList.contains("delete-btn")) {
        let key = event.target.closest("li").dataset.id;
        if (confirm("Are you sure you want to delete this product?")) {
            remove(ref(db, `products/${key}`));
        }
    }
});

// Search Products
document.getElementById('searchBox').addEventListener('input', function() {
    let filter = this.value.toLowerCase();
    let items = document.querySelectorAll('#productList li');
    items.forEach(item => {
        let productName = item.querySelector('strong').textContent.toLowerCase();
        item.style.display = productName.includes(filter) ? '' : 'none';
    });
});

// Load products initially
loadProducts();
