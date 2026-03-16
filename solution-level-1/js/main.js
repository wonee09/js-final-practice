import { getExpenses, createExpense, deleteExpense } from './api.js';
import { renderExpenses } from './render/list.js';
import { renderTotalAmount } from './render/stats.js';

// ===== DOM 요소 가져오기 =====
const expenseForm = document.getElementById('expense-form');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');

// ===== 앱 초기화 함수 =====
async function init() {
  const expenses = await getExpenses();
  renderExpenses(expenses);
  renderTotalAmount(expenses);
}

// ===== 지출 추가 처리 =====
async function handleSubmit(e) {
  e.preventDefault();

  const expenseData = {
    date: dateInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    amount: Number(amountInput.value),
  };

  await createExpense(expenseData);
  expenseForm.reset();
  await init();
}

// ===== 삭제 처리 =====
async function handleDelete(e) {
  if (!e.target.classList.contains('btn-delete')) return;

  const id = e.target.dataset.id;
  await deleteExpense(id);
  await init();
}

// ===== 이벤트 리스너 등록 =====
expenseForm.addEventListener('submit', handleSubmit);
document.getElementById('expense-list').addEventListener('click', handleDelete);

// ===== 앱 시작 =====
init();
