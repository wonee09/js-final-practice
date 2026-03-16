/**
 * 사용자에게 메시지를 표시합니다. (성공/에러)
 * @param {'success'|'error'} type - 메시지 타입
 * @param {string} text - 표시할 메시지
 */
export function showMessage(type, text) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}
