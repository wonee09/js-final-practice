const FILTER_KEY = 'filterSettings';
const FORM_DRAFT_KEY = 'formDraft';

export function saveFilterSettings(settings) {
  localStorage.setItem(FILTER_KEY, JSON.stringify(settings));
}

export function loadFilterSettings() {
  const data = localStorage.getItem(FILTER_KEY);
  return data ? JSON.parse(data) : null;
}

export function saveFormDraft(draft) {
  sessionStorage.setItem(FORM_DRAFT_KEY, JSON.stringify(draft));
}

export function loadFormDraft() {
  const data = sessionStorage.getItem(FORM_DRAFT_KEY);
  return data ? JSON.parse(data) : null;
}

export function clearFormDraft() {
  sessionStorage.removeItem(FORM_DRAFT_KEY);
}
