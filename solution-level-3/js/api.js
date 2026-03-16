const BASE_URL = 'http://localhost:4000/expenses';

export async function getExpenses() {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('지출 목록을 불러올 수 없습니다');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function createExpense(expenseData) {
  try {
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('지출 추가에 실패했습니다');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function updateExpense(id, expenseData) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData),
    });
    if (!response.ok) throw new Error('지출 수정에 실패했습니다');
    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function deleteExpense(id) {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('지출 삭제에 실패했습니다');
    return await response.json();
  } catch (error) {
    throw error;
  }
}
