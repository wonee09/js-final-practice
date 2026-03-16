import { calcTotal, calcCategoryTotals, calcAverage } from '../utils.js';

/**
 * 통계를 화면에 렌더링합니다.
 * - 총 합계 (reduce)
 * - 카테고리별 합계 (reduce + Object.entries)
 * - 평균 지출
 * @param {Array} expenses - 지출 객체 배열
 */
export function renderStats(expenses) {
  const totalEl = document.getElementById('total-amount');
  const categoryEl = document.getElementById('category-stats');
  const averageEl = document.getElementById('average-amount');

  // 총 합계
  const total = calcTotal(expenses);
  totalEl.textContent = `${total.toLocaleString()}원`;

  // 카테고리별 합계
  const categoryTotals = calcCategoryTotals(expenses);
  categoryEl.innerHTML = categoryTotals
    .map(
      ([category, amount]) =>
        `<div class="stat-item"><span>${category}</span><span>${amount.toLocaleString()}원</span></div>`
    )
    .join('');

  // 평균
  const average = calcAverage(expenses);
  averageEl.textContent = `${average.toLocaleString()}원`;
}
