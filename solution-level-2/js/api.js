const BASE_URL = 'http://localhost:4000/expenses';

export async function getExpenses() {
  const response = await fetch(BASE_URL);
  return response.json();
}

export async function createExpense(expenseData) {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData),
  });
  return response.json();
}

export async function updateExpense(id, expenseData) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expenseData),
  });
  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  return response.json();
}
