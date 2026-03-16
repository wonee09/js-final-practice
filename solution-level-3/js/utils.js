/**
 * 지출 배열을 정렬합니다. (스프레드 연산자로 원본 보존)
 */
export function sortExpenses(expenses, sortType) {
  const sorted = [...expenses];
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

/**
 * 카테고리별 필터링
 */
export function filterByCategory(expenses, category) {
  if (category === '전체') return [...expenses];
  return expenses.filter(({ category: cat }) => cat === category);
}

/**
 * 총 합계 계산 (reduce 활용)
 */
export function calcTotal(expenses) {
  return expenses.reduce((sum, { amount }) => sum + amount, 0);
}

/**
 * 카테고리별 합계 (reduce + Object.entries)
 */
export function calcCategoryTotals(expenses) {
  const totals = expenses.reduce((acc, { category, amount }) => {
    acc[category] = (acc[category] ?? 0) + amount;
    return acc;
  }, {});
  return Object.entries(totals);
}

/**
 * 평균 지출 계산
 */
export function calcAverage(expenses) {
  if (expenses.length === 0) return 0;
  return Math.round(calcTotal(expenses) / expenses.length);
}
