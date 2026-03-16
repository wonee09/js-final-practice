export function debounce(func, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}

export function sortTransactions(transactions, sortType) {
  const sorted = [...transactions];
  switch (sortType) {
    case 'date-desc':
      return sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    case 'date-asc':
      return sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
    case 'amount-desc':
      return sorted.sort((a, b) => b.amount - a.amount);
    case 'amount-asc':
      return sorted.sort((a, b) => a.amount - b.amount);
    default:
      return sorted;
  }
}

export function filterTransactions(transactions, { type, category, searchTerm }) {
  return transactions.filter((t) => {
    if (type !== '전체' && t.type !== type) return false;
    if (category !== '전체' && t.category !== category) return false;
    if (searchTerm && !t.description.includes(searchTerm)) return false;
    return true;
  });
}

export function calcTotalByType(transactions, type) {
  return transactions
    .filter((t) => t.type === type)
    .reduce((sum, { amount }) => sum + amount, 0);
}

export function calcBalance(transactions) {
  const income = calcTotalByType(transactions, 'income');
  const expense = calcTotalByType(transactions, 'expense');
  return income - expense;
}

export function calcCategoryTotals(transactions) {
  const totals = transactions.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] ?? 0) + amount;
    return acc;
  }, {});
  return Object.entries(totals);
}

export function calcMonthlyStats(transactions) {
  const monthlyMap = new Map();

  transactions.forEach(({ date, type, amount }) => {
    const monthKey = date.substring(0, 7);
    if (!monthlyMap.has(monthKey)) {
      monthlyMap.set(monthKey, { income: 0, expense: 0 });
    }
    const stats = monthlyMap.get(monthKey);
    if (type === 'income') {
      stats.income += amount;
    } else {
      stats.expense += amount;
    }
  });

  return [...monthlyMap.entries()]
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
      balance: income - expense,
    }));
}
