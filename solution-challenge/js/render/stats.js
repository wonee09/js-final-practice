import { calcTotalByType, calcBalance, calcCategoryTotals, calcMonthlyStats } from '../utils.js';

export function renderDashboard(transactions) {
  const incomeEl = document.getElementById('total-income');
  const expenseEl = document.getElementById('total-expense');
  const balanceEl = document.getElementById('balance');

  const totalIncome = calcTotalByType(transactions, 'income');
  const totalExpense = calcTotalByType(transactions, 'expense');
  const balance = calcBalance(transactions);

  incomeEl.textContent = `${totalIncome.toLocaleString()}원`;
  expenseEl.textContent = `${totalExpense.toLocaleString()}원`;
  balanceEl.textContent = `${balance.toLocaleString()}원`;
}

export function renderCategoryStats(transactions) {
  const container = document.getElementById('category-stats');
  const categoryTotals = calcCategoryTotals(transactions);

  container.innerHTML = categoryTotals
    .map(([category, amount]) => `
      <div class="stat-item">
        <span>${category}</span>
        <span>${amount.toLocaleString()}원</span>
      </div>
    `)
    .join('');
}

export function renderMonthlyStats(transactions) {
  const container = document.getElementById('monthly-stats');
  const monthlyData = calcMonthlyStats(transactions);

  if (monthlyData.length === 0) {
    container.innerHTML = '<p>데이터가 없습니다</p>';
    return;
  }

  container.innerHTML = `
    <table class="monthly-table">
      <thead>
        <tr><th>월</th><th>수입</th><th>지출</th><th>잔액</th></tr>
      </thead>
      <tbody>
        ${monthlyData.map(({ month, income, expense, balance }) => `
          <tr>
            <td>${month}</td>
            <td class="income">${income.toLocaleString()}원</td>
            <td class="expense">${expense.toLocaleString()}원</td>
            <td>${balance.toLocaleString()}원</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
}
