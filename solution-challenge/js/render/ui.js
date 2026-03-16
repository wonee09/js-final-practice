export function showMessage(type, text) {
  const messageEl = document.getElementById('message');
  messageEl.textContent = text;
  messageEl.className = `message ${type}`;
  messageEl.style.display = 'block';
  setTimeout(() => {
    messageEl.style.display = 'none';
  }, 3000);
}

export function showLoading() {
  document.getElementById('loading').style.display = 'flex';
}

export function hideLoading() {
  document.getElementById('loading').style.display = 'none';
}
