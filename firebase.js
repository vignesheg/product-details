import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js";

const firebaseConfig = {

    apiKey: "AIzaSyCPgo2oYlLinN8_rtXdzADEXyEo1ByZwq0",
  
    authDomain: "product-details-3511d.firebaseapp.com",
  
    projectId: "product-details-3511d",
  
    storageBucket: "product-details-3511d.firebasestorage.app",
  
    messagingSenderId: "471810249546",
  
    appId: "1:471810249546:web:d298cdb40650181b09a7b3",
  
    measurementId: "G-1Q73VN0H1K"
  
  };
  

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const productRef = ref(db, "products");

document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("productName").value;
    const details = document.getElementById("productDetails").value;
    const price = document.getElementById("productPrice").value;
    
    const newProduct = push(productRef);
    set(newProduct, { name, details, price });
    
    this.reset();
});

function loadProducts() {
    onValue(productRef, (snapshot) => {
        const productList = document.getElementById("productList");
        productList.innerHTML = "";
        snapshot.forEach((childSnapshot) => {
            const product = childSnapshot.val();
            const key = childSnapshot.key;
            
            const li = document.createElement("li");
            li.className = "list-group-item";
            li.innerHTML = `
                <strong>${product.name}</strong><br>
                ${product.details}<br>
                Price: Rs:${product.price}<br>
                <button class="btn btn-warning btn-sm me-2" onclick="editProduct('${key}', '${product.name}', '${product.details}', '${product.price}')">Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteProduct('${key}')">Delete</button>
            `;
            productList.appendChild(li);
        });
    });
}

window.editProduct = function(key, name, details, price) {
    const newName = prompt("Edit Product Name", name);
    const newDetails = prompt("Edit Product Details", details);
    const newPrice = prompt("Edit Price", price);
    if (newName && newDetails && newPrice) {
        update(ref(db, `products/${key}`), { name: newName, details: newDetails, price: newPrice });
    }
};

window.deleteProduct = function(key) {
    if (confirm("Are you sure you want to delete this product?")) {
        remove(ref(db, `products/${key}`));
    }
};

loadProducts();
