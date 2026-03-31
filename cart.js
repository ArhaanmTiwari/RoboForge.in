// Update cart bubble on load
window.onload = function() { updateCartBubble(); }

// Add item to cart (with alert)
window.addToCart = function(productName, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name: productName, price: price });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBubble();
  // Show toast instead of alert
  showCartToast(productName + " added to cart! 🛒");
}

// Buy Now - add to cart silently and go to checkout
window.buyNow = function(productName, price) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name: productName, price: price });
  localStorage.setItem("cart", JSON.stringify(cart));
  window.location.href = 'checkout.html';
}

// Show toast notification
function showCartToast(msg) {
  let toast = document.getElementById('cart-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cart-toast';
    toast.style.cssText = 'position:fixed;bottom:2rem;right:2rem;background:#042C53;color:#fff;padding:12px 20px;border-radius:10px;font-size:14px;font-weight:500;font-family:DM Sans,sans-serif;z-index:9999;opacity:0;transform:translateY(10px);transition:all 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; }, 2500);
}

// Load cart items into sidebar
window.loadCart = function() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartContainer = document.getElementById("cart-items");
  let total = 0;
  cartContainer.innerHTML = "";
  cart.forEach((item, index) => {
    total += item.price;
    cartContainer.innerHTML += `
      <div class="cart-item">
        <span>${item.name} - ₹${item.price}</span>
        <button class="remove-btn" onclick="removeItem(${index})">X</button>
      </div>
    `;
  });
  document.getElementById("total").innerText = "Total: ₹" + total;
  updateCartBubble();
}

// Remove item from cart
window.removeItem = function(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  loadCart();
}

// Toggle cart sidebar
window.toggleCart = function() {
  document.getElementById("cart-sidebar").classList.toggle("active");
  updateCartBubble();
  loadCart();
}

// Update cart count bubble
window.updateCartBubble = function() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const bubble = document.getElementById("cart-count");
  if (bubble) bubble.textContent = cart.length;
}