/**
 * 총 지출 합계를 화면에 표시합니다.
 * reduce와 구조분해할당을 사용합니다.
 * @param {Array} expenses - 지출 객체 배열
 */
export function renderTotalAmount(expenses) {
  const totalElement = document.getElementById('total-amount');
  const total = expenses.reduce((sum, { amount }) => sum + amount, 0);
  totalElement.textContent = `${total.toLocaleString()}원`;
}
