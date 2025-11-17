document.addEventListener("DOMContentLoaded", () => {

  // =======================
  // TAB SWITCHING
  // =======================
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(targetId);

      if (!targetSection) return;

      // Remove 'active' from all sections
      sections.forEach(sec => sec.classList.remove("active"));
      targetSection.classList.add("active");

      // Optional: highlight active tab button
      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });

  // =======================
  // BILLS SYSTEM
  // =======================
  let bills = JSON.parse(localStorage.getItem("bills")) || [];

  const billForm = document.getElementById("billForm");
  const billList = document.getElementById("billList");
  const totalAmount = document.getElementById("totalAmount");

  // Render bills on screen
  function renderBills() {
    billList.innerHTML = "";

    bills.forEach((bill, index) => {
      const div = document.createElement("div");
      div.className = "bill-item";

      div.innerHTML = `
        <h4>${bill.name}</h4>
        <p>Amount: $${bill.amount.toFixed(2)}</p>
        <p>Due: ${bill.due}</p>
        <button class="delete-btn" onclick="deleteBill(${index})">Delete</button>
      `;

      billList.appendChild(div);

      // Sparkle animation for new bill
      div.style.animation = "sparkle 0.8s ease";
      setTimeout(() => div.style.animation = "", 800);
    });

    calculateTotal();
  }

  // Add a new bill
  billForm.addEventListener("submit", e => {
    e.preventDefault();

    const name = document.getElementById("billName").value.trim();
    const amount = parseFloat(document.getElementById("billAmount").value);
    const due = document.getElementById("billDue").value;

    if (!name || isNaN(amount) || !due) return;

    bills.push({ name, amount, due });
    localStorage.setItem("bills", JSON.stringify(bills));

    billForm.reset();
    renderBills();
  });

  // Delete a bill
  window.deleteBill = function(index) {
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    renderBills();
  };

  // Calculate total
  function calculateTotal() {
    const total = bills.reduce((sum, item) => sum + item.amount, 0);
    totalAmount.textContent = total.toFixed(2);
  }

  // Initial render
  renderBills();
});
