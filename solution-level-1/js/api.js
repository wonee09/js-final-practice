const BASE_URL = 'http://localhost:4000/expenses';

/**
 * 모든 지출 목록을 가져옵니다.
 * @returns {Promise<Array>} 지출 목록 배열
 */
export async function getExpenses() {
  const response = await fetch(BASE_URL);
  return response.json();
}

/**
 * 새로운 지출을 추가합니다.
 * @param {Object} expenseData - { date, category, description, amount }
 * @returns {Promise<Object>} 생성된 지출 객체
 */
export async function createExpense(expenseData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData),
  });
  return response.json();
}

/**
 * 지출을 삭제합니다.
 * @param {number} id - 삭제할 지출의 id
 * @returns {Promise<Object>} 삭제 응답
 */
export async function deleteExpense(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
