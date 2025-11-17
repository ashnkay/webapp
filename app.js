document.addEventListener("DOMContentLoaded", () => {
  // ======= TAB SWITCHING =======
  const tabs = document.querySelectorAll(".tabs button");
  const sections = document.querySelectorAll(".tab");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const targetId = tab.getAttribute("data-tab");
      const targetSection = document.getElementById(targetId);
      sections.forEach(sec => sec.classList.remove("active"));
      targetSection.classList.add("active");

      tabs.forEach(t => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");
    });
  });

  // ======= MONTHLY CALENDAR =======
  const monthGrid = document.getElementById("monthGrid");
  const billModal = document.getElementById("billModal");
  const modalDay = document.getElementById("modalDay");
  const modalBillName = document.getElementById("modalBillName");
  const modalBillAmount = document.getElementById("modalBillAmount");
  const saveBillBtn = document.getElementById("saveBillBtn");
  const closeModal = document.querySelector(".close");
  const weeklyTotalsList = document.getElementById("weeklyTotalsList");

  const savingsInput = document.getElementById("savingsInput");
  const saveSavingsBtn = document.getElementById("saveSavingsBtn");
  const savingsTotal = document.getElementById("savingsTotal");

  let bills = JSON.parse(localStorage.getItem("bills")) || {};
  let savings = parseFloat(localStorage.getItem("savings")) || 0;
  savingsTotal.textContent = savings.toFixed(2);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  let weekCounter = 1;
  let weekSums = {};

  // Generate calendar
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    monthGrid.appendChild(emptyCell);
  }

  for (let day = 1; day <= lastDate; day++) {
    const dayDiv = document.createElement("div");
    dayDiv.className = "day";
    dayDiv.textContent = day;
    dayDiv.dataset.date = `${year}-${month + 1}-${day}`;
    monthGrid.appendChild(dayDiv);

    // Assign week number
    const weekNumber = Math.ceil((day + firstDay) / 7);
    dayDiv.dataset.week = weekNumber;

    dayDiv.addEventListener("click", () => {
      modalDay.textContent = `Day ${day}`;
      billModal.style.display = "block";
      modalBillName.value = "";
      modalBillAmount.value = "";
      saveBillBtn.dataset.date = dayDiv.dataset.date;
      saveBillBtn.dataset.week = weekNumber;
    });
  }

  // Close modal
  closeModal.addEventListener("click", () => billModal.style.display = "none");
  window.addEventListener("click", e => {
    if (e.target === billModal) billModal.style.display = "none";
  });

  // Save bill
  saveBillBtn.addEventListener("click", () => {
    const name = modalBillName.value.trim();
    const amount = parseFloat(modalBillAmount.value);
    const date = saveBillBtn.dataset.date;
    const week = saveBillBtn.dataset.week;

    if (!name || isNaN(amount) || amount <= 0) return;

    if (!bills[date]) bills[date] = [];
    bills[date].push({ name, amount });

    localStorage.setItem("bills", JSON.stringify(bills));
    billModal.style.display = "none";
    calculateWeeklyTotals();
  });

  // Calculate weekly totals
  function calculateWeeklyTotals() {
    weekSums = {};
    for (const date in bills) {
      const week = new Date(date).getDate() + firstDay;
      const weekNumber = Math.ceil(week / 7);
      if (!weekSums[weekNumber]) weekSums[weekNumber] = 0;
      weekSums[weekNumber] += bills[date].reduce((sum, b) => sum + b.amount, 0);
    }

    weeklyTotalsList.innerHTML = "";
    for (const week in weekSums) {
      const li = document.createElement("li");
      li.textContent = `Week ${week}: $${weekSums[week].toFixed(2)}`;
      weeklyTotalsList.appendChild(li);
    }
  }

  // Savings
  saveSavingsBtn.addEventListener("click", () => {
    const amount = parseFloat(savingsInput.value);
    if (isNaN(amount) || amount <= 0) return;
    savings += amount;
    localStorage.setItem("savings", savings);
    savingsTotal.textContent = savings.toFixed(2);
    savingsInput.value = "";
  });

  calculateWeeklyTotals();
});
