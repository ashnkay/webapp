document.addEventListener("DOMContentLoaded", () => {

  // ======= TAB SWITCHING =======
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(targetId);
      if (!targetSection) return;

      sections.forEach(sec => sec.classList.remove("active"));
      targetSection.classList.add("active");

      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });

  // ======= BILLS SYSTEM =======
  let bills = JSON.parse(localStorage.getItem("bills")) || [];

  const billForm = document.getElementById("billForm");
  const billList = document.getElementById("billList");
  const totalAmount = document.getElementById("totalAmount");

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
        <button class="subtract-btn" onclick="subtractBill(${index})">Subtract</button>
      `;

      billList.appendChild(div);
      div.style.animation = "sparkle 0.8s ease";
      setTimeout(() => div.style.animation = "", 800);
    });

    calculateTotal();
  }

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

  window.deleteBill = function(index) {
    bills.splice(index, 1);
    localStorage.setItem("bills", JSON.stringify(bills));
    renderBills();
  };

  // ======= SUBTRACT FUNCTION =======
  window.subtractBill = function(index) {
    const bill = bills[index];
    let subtractAmount = prompt(`Enter amount to subtract from "${bill.name}":`, "0");

    if (subtractAmount === null) return; // cancel pressed
    subtractAmount = parseFloat(subtractAmount);

    if (isNaN(subtractAmount) || subtractAmount <= 0) {
      alert("Enter a valid number greater than 0.");
      return;
    }
    if (subtractAmount > bill.amount) {
      alert("Cannot subtract more than the current bill amount.");
      return;
    }

    bills[index].amount -= subtractAmount;
    localStorage.setItem("bills", JSON.stringify(bills));
    renderBills();
  };

  function calculateTotal() {
    const total = bills.reduce((sum, item) => sum + item.amount, 0);
    totalAmount.textContent = total.toFixed(2);
  }

  renderBills();
});
