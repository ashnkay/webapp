// Tab Switching
const tabs = document.querySelectorAll(".tabs button");
const sections = document.querySelectorAll(".tab");

tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;

    sections.forEach(sec => sec.classList.remove("active"));
    document.getElementById(target).classList.add("active");
  });
});
// =======================
// Bills System
// =======================

let bills = JSON.parse(localStorage.getItem("bills")) || [];

const billForm = document.getElementById("billForm");
const billList = document.getElementById("billList");
const totalAmount = document.getElementById("totalAmount");

// Render Bills
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
  });

  calculateTotal();
}

// Add Bill
billForm.addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("billName").value;
  const amount = parseFloat(document.getElementById("billAmount").value);
  const due = document.getElementById("billDue").value;

  bills.push({ name, amount, due });
  localStorage.setItem("bills", JSON.stringify(bills));

  billForm.reset();
  renderBills();
});

// Delete Bill
function deleteBill(index) {
  bills.splice(index, 1);
  localStorage.setItem("bills", JSON.stringify(bills));
  renderBills();
}

// Total Calculator
function calculateTotal() {
  const total = bills.reduce((sum, item) => sum + item.amount, 0);
  totalAmount.textContent = total.toFixed(2);
}

// Initial Render
renderBills();
