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

// Init EmailJS
(function() {
  var script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
  script.onload = () => emailjs.init('0SMai0kepsxfVg2je');
  document.head.appendChild(script);
})();

window.placeOrder = async function() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const address = document.getElementById("address").value.trim();

  if (!name || !email || !phone || !address) {
    alert("Please fill all details!");
    return;
  }

  const order = "ORD" + Date.now();
  const items = cart.map((item) => item.name).join(", ");
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  try {
    const btn = document.getElementById("place-order-btn");
    if (btn) { btn.disabled = true; btn.textContent = "Placing Order..."; }

    // Save to Google Sheets
    const params = new URLSearchParams({ order, name, email, phone, address, items, total });
    await fetch(
      "https://script.google.com/macros/s/AKfycbwp0Mise2QG0BCtgNp59nAXq6k8w070W1Sz9lBdjtxxzhgoOysD0j4h5jeJr41-vzR2Sg/exec?" +
      params.toString()
    );

    // Save to Firebase
    await addDoc(collection(db, "orders"), {
      orderId: order,
      name, email, phone, address, items, total,
      status: "Received",
      createdAt: serverTimestamp()
    });

    // Send confirmation email
    try {
      await emailjs.send('service_ij5br65', 'template_zga47lv', {
        email, order_id: order,
        orders: [{ name: items, price: total, units: 1 }],
        name: items, price: total, units: 1,
        'cost.shipping': 0, 'cost.tax': 0, 'cost.total': total
      });
    } catch(e) { console.error('Email failed:', e); }

    localStorage.removeItem("cart");
    window.location.href = "success.html?order=" + order;

  } catch(err) {
    alert("Something went wrong! Please try again.");
    console.error(err);
    const btn = document.getElementById("place-order-btn");
    if (btn) { btn.disabled = false; btn.textContent = "Place Order"; }
  }
}