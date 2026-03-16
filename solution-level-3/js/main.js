import { getExpenses, createExpense, updateExpense, deleteExpense } from './api.js';
import { sortExpenses, filterByCategory } from './utils.js';
import { renderExpenses } from './render/list.js';
import { renderStats } from './render/stats.js';
import { showMessage } from './render/ui.js';

// ===== DOM 요소 =====
const expenseForm = document.getElementById('expense-form');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const sortSelect = document.getElementById('sort-select');
const filterBtns = document.querySelectorAll('.filter-btn');

// ===== 상태 =====
let editingId = null;
let allExpenses = [];
let currentFilter = '전체';
let currentSort = 'date-desc';

// ===== 초기화 =====
async function init() {
  try {
    allExpenses = await getExpenses();
    render();
  } catch (error) {
    showMessage('error', error?.message ?? '데이터를 불러오는데 실패했습니다');
  }
}

// ===== 렌더링 =====
function render() {
  const filtered = filterByCategory(allExpenses, currentFilter);
  const sorted = sortExpenses(filtered, currentSort);
  renderExpenses(sorted);
  renderStats(filtered);
}

// ===== 폼 제출 =====
async function handleSubmit(e) {
  e.preventDefault();

  const expenseData = {
    date: dateInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    amount: Number(amountInput.value),
  };

  try {
    if (editingId) {
      await updateExpense(editingId, expenseData);
      showMessage('success', '지출이 수정되었습니다');
      cancelEdit();
    } else {
      await createExpense(expenseData);
      showMessage('success', '지출이 추가되었습니다');
    }
    expenseForm.reset();
    await init();
  } catch (error) {
    showMessage('error', error?.message ?? '요청 처리에 실패했습니다');
  }
}

// ===== 수정 =====
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
  cancelBtn.style.display = 'inline-block';
}

// ===== 삭제 =====
async function handleDelete(e) {
  if (!e.target.classList.contains('btn-delete')) return;

  try {
    const id = e.target.dataset.id;
    await deleteExpense(id);
    showMessage('success', '지출이 삭제되었습니다');
    await init();
  } catch (error) {
    showMessage('error', error?.message ?? '삭제에 실패했습니다');
  }
}

// ===== 수정 취소 =====
function cancelEdit() {
  editingId = null;
  submitBtn.textContent = '추가';
  cancelBtn.style.display = 'none';
  expenseForm.reset();
}

// ===== 필터 =====
function handleFilter(e) {
  if (!e.target.classList.contains('filter-btn')) return;
  filterBtns.forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.category;
  render();
}

// ===== 정렬 =====
function handleSort() {
  currentSort = sortSelect.value;
  render();
}

// ===== 이벤트 리스너 =====
expenseForm.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', cancelEdit);
document.getElementById('expense-list').addEventListener('click', handleEdit);
document.getElementById('expense-list').addEventListener('click', handleDelete);
document.getElementById('filter-section').addEventListener('click', handleFilter);
sortSelect.addEventListener('change', handleSort);

// ===== 앱 시작 =====
init();
