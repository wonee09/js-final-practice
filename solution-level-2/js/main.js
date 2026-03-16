import { getExpenses, createExpense, updateExpense, deleteExpense } from './api.js';
import { renderExpenses } from './render/list.js';
import { renderTotalAmount } from './render/stats.js';

// ===== DOM 요소 가져오기 =====
const expenseForm = document.getElementById('expense-form');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const submitBtn = document.getElementById('submit-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== 상태 관리 =====
let editingId = null;
let allExpenses = [];
let currentFilter = '전체';

// ===== 앱 초기화 =====
async function init() {
  allExpenses = await getExpenses();
  applyFilter();
}

// ===== 필터 적용 =====
function applyFilter() {
  const filtered =
    currentFilter === '전체'
      ? allExpenses
      : allExpenses.filter(({ category }) => category === currentFilter);

  renderExpenses(filtered);
  renderTotalAmount(filtered);
}

// ===== 폼 제출 처리 (추가 / 수정) =====
async function handleSubmit(e) {
  e.preventDefault();

  const expenseData = {
    date: dateInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    amount: Number(amountInput.value),
  };

  if (editingId) {
    await updateExpense(editingId, expenseData);
    editingId = null;
    submitBtn.textContent = '추가';
  } else {
    await createExpense(expenseData);
  }

  expenseForm.reset();
  await init();
}

// ===== 수정 버튼 처리 =====
function handleEdit(e) {
  if (!e.target.classList.contains('btn-edit')) return;

  const id = e.target.dataset.id;
  const expense = allExpenses.find((exp) => String(exp.id) === id);
  if (!expense) return;

  const { date, category, description, amount } = expense;
  dateInput.value = date;
  categorySelect.value = category;
  descriptionInput.value = description;
  amountInput.value = amount;

  editingId = id;
  submitBtn.textContent = '수정';
}

// ===== 삭제 처리 =====
async function handleDelete(e) {
  if (!e.target.classList.contains('btn-delete')) return;

  const id = e.target.dataset.id;
  await deleteExpense(id);
  await init();
}

// ===== 필터 처리 =====
function handleFilter(e) {
  if (!e.target.classList.contains('filter-btn')) return;

  filterBtns.forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.category;
  applyFilter();
}

// ===== 이벤트 리스너 등록 =====
expenseForm.addEventListener('submit', handleSubmit);
document.getElementById('expense-list').addEventListener('click', handleEdit);
document.getElementById('expense-list').addEventListener('click', handleDelete);
document.getElementById('filter-section').addEventListener('click', handleFilter);

// ===== 앱 시작 =====
init();
