export function renderTransactions(transactions, selectedIds) {
  const tbody = document.getElementById('transaction-list');
  const selectedSet = new Set(selectedIds);

  tbody.innerHTML = transactions
    .map(({ id, type, date, category, description, amount }) => {
      const typeLabel = type === 'income' ? '수입' : '지출';
      const typeClass = type === 'income' ? 'type-income' : 'type-expense';
      const checked = selectedSet.has(String(id)) ? 'checked' : '';
      return `
        <tr class="${typeClass}">
          <td><input type="checkbox" class="item-checkbox" data-id="${id}" ${checked} /></td>
          <td>${date}</td>
          <td>${typeLabel}</td>
          <td>${category}</td>
          <td>${description}</td>
          <td>${amount.toLocaleString()}원</td>
          <td><button class="btn-edit" data-id="${id}">수정</button></td>
          <td><button class="btn-delete" data-id="${id}">삭제</button></td>
        </tr>
      `;
    })
    .join('');
}
