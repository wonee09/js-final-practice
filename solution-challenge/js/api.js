const BASE_URL = 'http://localhost:4000';

export async function getTransactions() {
  const response = await fetch(`${BASE_URL}/transactions`);
  if (!response.ok) throw new Error('내역을 불러올 수 없습니다');
  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) throw new Error('카테고리를 불러올 수 없습니다');
  return response.json();
}

export async function loadInitialData() {
  const [transactions, categories] = await Promise.all([
    getTransactions(),
    getCategories(),
  ]);
  return { transactions, categories };
}

export async function createTransaction(data) {
  const response = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('추가에 실패했습니다');
  return response.json();
}

export async function updateTransaction(id, data) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('수정에 실패했습니다');
  return response.json();
}

export async function deleteTransaction(id) {
  const response = await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('삭제에 실패했습니다');
  return response.json();
}

export async function deleteTransactions(ids) {
  const deletePromises = ids.map((id) =>
    fetch(`${BASE_URL}/transactions/${id}`, { method: 'DELETE' })
  );
  return Promise.all(deletePromises);
}
