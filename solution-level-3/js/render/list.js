/**
 * 지출 목록을 화면에 렌더링합니다.
 * map, 구조분해할당, 템플릿 리터럴을 사용합니다.
 * @param {Array} expenses - 지출 객체 배열
 */
export function renderExpenses(expenses) {
  const tbody = document.getElementById('expense-list');
  tbody.innerHTML = expenses
    .map(
      ({ id, date, category, description, amount }) => `
      <tr>
        <td>${date}</td>
        <td>${category}</td>
        <td>${description}</td>
        <td>${amount.toLocaleString()}원</td>
        <td><button class="btn-edit" data-id="${id}">수정</button></td>
        <td><button class="btn-delete" data-id="${id}">삭제</button></td>
      </tr>
    `
    )
    .join('');
}
