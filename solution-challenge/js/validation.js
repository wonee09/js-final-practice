const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateTransaction({ type, date, category, description, amount }) {
  const errors = [];

  if (!type || (type !== 'income' && type !== 'expense')) {
    errors.push('유형을 선택해주세요');
  }
  if (!date || !DATE_REGEX.test(date)) {
    errors.push('올바른 날짜를 입력해주세요 (YYYY-MM-DD)');
  }
  if (!category) {
    errors.push('카테고리를 선택해주세요');
  }
  if (!description || description.trim() === '') {
    errors.push('설명을 입력해주세요');
  }
  if (!amount || Number(amount) <= 0) {
    errors.push('금액은 양수여야 합니다');
  }

  return errors;
}
