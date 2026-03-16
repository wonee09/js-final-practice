import { loadInitialData, createTransaction, updateTransaction, deleteTransaction, deleteTransactions } from './api.js';
import { debounce, sortTransactions, filterTransactions } from './utils.js';
import { validateTransaction } from './validation.js';
import { saveFilterSettings, loadFilterSettings, saveFormDraft, loadFormDraft, clearFormDraft } from './storage.js';
import { renderTransactions } from './render/list.js';
import { renderDashboard, renderCategoryStats, renderMonthlyStats } from './render/stats.js';
import { showMessage, showLoading, hideLoading } from './render/ui.js';

// DOM elements
const form = document.getElementById('transaction-form');
const typeSelect = document.getElementById('type');
const dateInput = document.getElementById('date');
const categorySelect = document.getElementById('category');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const submitBtn = document.getElementById('submit-btn');
const cancelBtn = document.getElementById('cancel-btn');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort-select');
const typeBtns = document.querySelectorAll('.type-btn');
const categoryBtns = document.getElementById('category-filters');
const selectAllCheckbox = document.getElementById('select-all');
const bulkDeleteBtn = document.getElementById('bulk-delete');

// State
let allTransactions = [];
let allCategories = [];
let editingId = null;
let selectedIds = [];
let filters = { type: '전체', category: '전체', searchTerm: '' };
let currentSort = 'date-desc';

// Initialize
async function init() {
  showLoading();
  try {
    const savedSettings = loadFilterSettings();
    if (savedSettings) {
      filters = { ...filters, ...savedSettings };
      currentSort = savedSettings.sort ?? currentSort;
      sortSelect.value = currentSort;
    }

    const { transactions, categories } = await loadInitialData();
    allTransactions = transactions;
    allCategories = categories;

    updateCategoryOptions();
    restoreFormDraft();
    render();
  } catch (error) {
    showMessage('error', error?.message ?? '데이터를 불러오는데 실패했습니다');
  } finally {
    hideLoading();
  }
}

function render() {
  const filtered = filterTransactions(allTransactions, filters);
  const sorted = sortTransactions(filtered, currentSort);
  renderTransactions(sorted, selectedIds);
  renderDashboard(allTransactions);
  renderCategoryStats(filtered);
  renderMonthlyStats(allTransactions);
}

function updateCategoryOptions() {
  const type = typeSelect.value;
  const filtered = type
    ? allCategories.filter((c) => c.type === type)
    : allCategories;

  categorySelect.innerHTML = '<option value="">카테고리 선택</option>';
  filtered.forEach(({ name }) => {
    categorySelect.innerHTML += `<option value="${name}">${name}</option>`;
  });
}

function restoreFormDraft() {
  const draft = loadFormDraft();
  if (draft) {
    typeSelect.value = draft.type ?? '';
    updateCategoryOptions();
    dateInput.value = draft.date ?? '';
    categorySelect.value = draft.category ?? '';
    descriptionInput.value = draft.description ?? '';
    amountInput.value = draft.amount ?? '';
  }
}

function saveCurrentFormDraft() {
  saveFormDraft({
    type: typeSelect.value,
    date: dateInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    amount: amountInput.value,
  });
}

// Handlers
async function handleSubmit(e) {
  e.preventDefault();

  const data = {
    type: typeSelect.value,
    date: dateInput.value,
    category: categorySelect.value,
    description: descriptionInput.value,
    amount: Number(amountInput.value),
  };

  const errors = validateTransaction(data);
  if (errors.length > 0) {
    showMessage('error', errors[0]);
    return;
  }

  showLoading();
  try {
    if (editingId) {
      await updateTransaction(editingId, data);
      showMessage('success', '내역이 수정되었습니다');
      cancelEdit();
    } else {
      await createTransaction(data);
      showMessage('success', '내역이 추가되었습니다');
    }
    form.reset();
    clearFormDraft();
    const { transactions } = await loadInitialData();
    allTransactions = transactions;
    render();
  } catch (error) {
    showMessage('error', error?.message ?? '요청 처리에 실패했습니다');
  } finally {
    hideLoading();
  }
}

function handleEdit(e) {
  if (!e.target.classList.contains('btn-edit')) return;

  const id = e.target.dataset.id;
  const transaction = allTransactions.find((t) => String(t.id) === id);
  if (!transaction) return;

  const { type, date, category, description, amount } = transaction;
  typeSelect.value = type;
  updateCategoryOptions();
  dateInput.value = date;
  categorySelect.value = category;
  descriptionInput.value = description;
  amountInput.value = amount;

  editingId = id;
  submitBtn.textContent = '수정';
  cancelBtn.style.display = 'inline-block';
}

async function handleDelete(e) {
  if (!e.target.classList.contains('btn-delete')) return;

  showLoading();
  try {
    const id = e.target.dataset.id;
    await deleteTransaction(id);
    showMessage('success', '내역이 삭제되었습니다');
    const { transactions } = await loadInitialData();
    allTransactions = transactions;
    selectedIds = selectedIds.filter((sid) => sid !== id);
    render();
  } catch (error) {
    showMessage('error', error?.message ?? '삭제에 실패했습니다');
  } finally {
    hideLoading();
  }
}

async function handleBulkDelete() {
  if (selectedIds.length === 0) {
    showMessage('error', '삭제할 항목을 선택해주세요');
    return;
  }

  showLoading();
  try {
    await deleteTransactions(selectedIds);
    showMessage('success', `${selectedIds.length}건이 삭제되었습니다`);
    selectedIds = [];
    selectAllCheckbox.checked = false;
    const { transactions } = await loadInitialData();
    allTransactions = transactions;
    render();
  } catch (error) {
    showMessage('error', error?.message ?? '일괄 삭제에 실패했습니다');
  } finally {
    hideLoading();
  }
}

function cancelEdit() {
  editingId = null;
  submitBtn.textContent = '추가';
  cancelBtn.style.display = 'none';
  form.reset();
}

function handleTypeFilter(e) {
  if (!e.target.classList.contains('type-btn')) return;
  typeBtns.forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');
  filters.type = e.target.dataset.type;
  filters.category = '전체';
  document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
  document.querySelector('.category-btn[data-category="전체"]').classList.add('active');
  saveFilterSettings({ ...filters, sort: currentSort });
  render();
}

function handleCategoryFilter(e) {
  if (!e.target.classList.contains('category-btn')) return;
  document.querySelectorAll('.category-btn').forEach((btn) => btn.classList.remove('active'));
  e.target.classList.add('active');
  filters.category = e.target.dataset.category;
  saveFilterSettings({ ...filters, sort: currentSort });
  render();
}

function handleSort() {
  currentSort = sortSelect.value;
  saveFilterSettings({ ...filters, sort: currentSort });
  render();
}

const handleSearch = debounce((e) => {
  filters.searchTerm = e.target.value;
  render();
}, 300);

function handleCheckbox(e) {
  if (e.target.classList.contains('item-checkbox')) {
    const id = e.target.dataset.id;
    if (e.target.checked) {
      selectedIds.push(id);
    } else {
      selectedIds = selectedIds.filter((sid) => sid !== id);
    }
  }
}

function handleSelectAll(e) {
  const checkboxes = document.querySelectorAll('.item-checkbox');
  selectedIds = [];
  if (e.target.checked) {
    checkboxes.forEach((cb) => {
      cb.checked = true;
      selectedIds.push(cb.dataset.id);
    });
  } else {
    checkboxes.forEach((cb) => {
      cb.checked = false;
    });
  }
}

// Event listeners
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', cancelEdit);
document.getElementById('transaction-list').addEventListener('click', handleEdit);
document.getElementById('transaction-list').addEventListener('click', handleDelete);
document.getElementById('transaction-list').addEventListener('change', handleCheckbox);
document.getElementById('type-filters').addEventListener('click', handleTypeFilter);
categoryBtns.addEventListener('click', handleCategoryFilter);
sortSelect.addEventListener('change', handleSort);
searchInput.addEventListener('input', handleSearch);
selectAllCheckbox.addEventListener('change', handleSelectAll);
bulkDeleteBtn.addEventListener('click', handleBulkDelete);
typeSelect.addEventListener('change', updateCategoryOptions);

// Save form draft on input
[typeSelect, dateInput, categorySelect, descriptionInput, amountInput].forEach((el) => {
  el.addEventListener('input', saveCurrentFormDraft);
  el.addEventListener('change', saveCurrentFormDraft);
});

init();
