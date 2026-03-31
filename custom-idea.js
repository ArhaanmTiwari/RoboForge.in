document.getElementById("ideaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = this.name.value.trim();
  const email = this.email.value.trim();
  const idea = this.idea.value.trim();

  if (!name || !email || !idea) {
    alert("Please fill all fields!");
    return;
  }

  const btn = this.querySelector("button[type='submit']");
  btn.textContent = "Sending...";
  btn.disabled = true;

  const params = new URLSearchParams({ name, email, idea });

  fetch(
    "https://script.google.com/macros/s/AKfycbwp0Mise2QG0BCtgNp59nAXq6k8w070W1Sz9lBdjtxxzhgoOysD0j4h5jeJr41-vzR2Sg/exec?",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    }
  )
    .then((res) => res.text())
    .then(() => {
      alert("Your idea was sent! We'll get back to you soon 🚀");
      document.getElementById("ideaForm").reset();
      btn.textContent = "Send Idea 🚀";
      btn.disabled = false;
    })
    .catch(() => {
      alert("Something went wrong. Please try again!");
      btn.textContent = "Send Idea 🚀";
      btn.disabled = false;
    });
});