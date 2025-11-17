document.addEventListener("DOMContentLoaded", () => {

  // ======= TAB SWITCHING =======
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      sections.forEach(sec => sec.classList.remove("active"));
      document.getElementById(targetId).classList.add("active");

      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });

  // ======= BILL CALENDAR SETUP =======
  const monthGrid = document.getElementById("monthGrid");
  const billModal = document.getElementById("billModal");
  const modalDay = document.getElementById("modalDay");
  const billList = document.getElementById("billList");
  const modalBillName = document.getElementById("modalBillName");
  const modalBillAmount = document.getElementById("modalBillAmount");
  const saveBillBtn = document.getElementById("saveBillBtn");
  const closeModal = document.querySelector(".close");
  const weeklyTotalsList = document.getElementById("weeklyTotalsList");

  const savingsAddInput = document.getElementById("savingsAddInput");
  const addSavingsBtn = document.getElementById("addSavingsBtn");
  const savingsSubtractInput = document.getElementById("savingsSubtractInput");
  const subtractSavingsBtn = document.getElementById("subtractSavingsBtn");
  const savingsTotal = document.getElementById("savingsTotal");

  let bills = JSON.parse(localStorage.getItem("bills")) || {};
  let savings = parseFloat(localStorage.getItem("savings")) || 0;
  savingsTotal.textContent = savings.toFixed(2);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  // ======= CREATE CALENDAR =======
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    monthGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = day;
    const dateKey = `${year}-${month + 1}-${day}`;
    dayDiv.dataset.date = dateKey;

    monthGrid.appendChild(dayDiv);

    dayDiv.addEventListener("click", () => {
      modalDay.textContent = `Day ${day}`;
      billModal.style.display = "block";
      modalBillName.value = "";
      modalBillAmount.value = "";
      saveBillBtn.dataset.date = dateKey;
      renderBillList(dateKey);
    });
  }

  // ======= MODAL CLOSE =======
  closeModal.addEventListener("click", () => billModal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === billModal) billModal.style.display = "none";
  });

  // ======= RENDER BILLS LIST IN MODAL =======
 // Inside renderBillList() after rendering bills for the modal
function renderBillList(date) {
  billList.innerHTML = "";
  const dayDiv = document.querySelector(`[data-date='${date}']`);

  if (!bills[date]) bills[date] = [];

  bills[date].forEach((bill, idx) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${bill.name}: $${bill.amount.toFixed(2)}
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    `;

    // Delete bill
    li.querySelector(".delete-btn").addEventListener("click", () => {
      bills[date].splice(idx, 1);
      if (bills[date].length === 0) {
        delete bills[date];
        dayDiv.classList.remove("has-bill"); // Remove highlight if no bills
      }
      localStorage.setItem("bills", JSON.stringify(bills));
      renderBillList(date);
      calculateWeeklyTotals();
    });

    // Edit bill
    li.querySelector(".edit-btn").addEventListener("click", () => {
      const newName = prompt("Edit Bill Name:", bill.name);
      const newAmount = parseFloat(prompt("Edit Amount:", bill.amount));
      if (newName && !isNaN(newAmount) && newAmount > 0) {
        bills[date][idx].name = newName;
        bills[date][idx].amount = newAmount;
        localStorage.setItem("bills", JSON.stringify(bills));
        renderBillList(date);
        calculateWeeklyTotals();
      }
    });

    billList.appendChild(li);
  });

  // Add glow class if there are bills
  if (bills[date] && bills[date].length > 0) {
    dayDiv.classList.add("has-bill");
  } else {
    dayDiv.classList.remove("has-bill");
  }
}

  // ======= SAVE BILL BUTTON =======
  saveBillBtn.addEventListener("click", () => {
    const date = saveBillBtn.dataset.date;
    const name = modalBillName.value.trim();
    const amount = parseFloat(modalBillAmount.value);

    if (!name || isNaN(amount) || amount <= 0) return;

    if (!bills[date]) bills[date] = [];
    bills[date].push({ name, amount });

    localStorage.setItem("bills", JSON.stringify(bills));
    modalBillName.value = "";
    modalBillAmount.value = "";
    renderBillList(date);
    calculateWeeklyTotals();
  });

  // ======= WEEKLY TOTALS =======
  function calculateWeeklyTotals() {
    weeklyTotalsList.innerHTML = "";
    const weekSums = {};

    for (const dateStr in bills) {
      const date = new Date(dateStr);
      const day = date.getDate();
      const weekNum = Math.ceil((day + firstDay) / 7);
      if (!weekSums[weekNum]) weekSums[weekNum] = 0;
      weekSums[weekNum] += bills[dateStr].reduce((sum, b) => sum + b.amount, 0);
    }

    for (const week in weekSums) {
      const li = document.createElement("li");
      li.textContent = `Week ${week}: $${weekSums[week].toFixed(2)}`;
      weeklyTotalsList.appendChild(li);
    }
  }

  // ======= SAVINGS SYSTEM =======
  addSavingsBtn.addEventListener("click", () => {
    const val = parseFloat(savingsAddInput.value);
    if (isNaN(val) || val <= 0) return;
    savings += val;
    localStorage.setItem("savings", savings);
    savingsTotal.textContent = savings.toFixed(2);
    savingsAddInput.value = "";
  });

  subtractSavingsBtn.addEventListener("click", () => {
    const val = parseFloat(savingsSubtractInput.value);
    if (isNaN(val) || val <= 0) return;
    if (val > savings) {
      alert("Cannot subtract more than current savings!");
      return;
    }
    savings -= val;
    localStorage.setItem("savings", savings);
    savingsTotal.textContent = savings.toFixed(2);
    savingsSubtractInput.value = "";
  });

  // Initial calculation
  calculateWeeklyTotals();
});
