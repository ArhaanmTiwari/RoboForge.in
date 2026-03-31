console.log("Webhook JS Loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBsvQD_h8-UCpt3FjcJC5rCFkoGagCmZo4",
  authDomain: "arhaan-tech.firebaseapp.com",
  projectId: "arhaan-tech",
  storageBucket: "arhaan-tech.firebasestorage.app",
  messagingSenderId: "378370431321",
  appId: "1:378370431321:web:c3e01ee291112ec24e9448"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.placeOrder = async function() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }
  

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();
  const email = document.getElementById("email").value.trim();
  

  if (!name || !phone || !address) {
    alert("Please fill all details!");
    return;
  }

  const order = "ORD" + Date.now();
  const items = cart.map((item) => item.name).join(", ");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const btn = document.getElementById("place-order-btn");
  btn.disabled = true;
  btn.textContent = "Placing order...";

  try {
    // Step 1 — Save to Google Sheets
    const params = new URLSearchParams({
      order, name, email, phone, address, items, total,
    });

    await fetch(
      "https://script.google.com/macros/s/AKfycbwp0Mise2QG0BCtgNp59nAXq6k8w070W1Sz9lBdjtxxzhgoOysD0j4h5jeJr41-vzR2Sg/exec?" +
      params.toString()
    );

    // Step 2 — Save to Firebase for customer order tracking
    await addDoc(collection(db, "orders"), {
      orderId: order,
      name: name,
      email: email,
      phone: phone,
      address: address,
      items: items,
      total: total,
      status: "Processing",
      createdAt: serverTimestamp()
    });

    // Step 3 — Clear cart and redirect
    localStorage.removeItem("cart");
    window.location.href = "success.html?order=" + order;

  } catch (err) {
    console.error("Order error:", err);
    alert("Something went wrong! Please try again.");
    btn.disabled = false;
    btn.textContent = "Place Order";
  }
}