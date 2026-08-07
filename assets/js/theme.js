const STORAGE_KEY = 'mtpcode-theme';

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  document.documentElement.style.colorScheme = theme;
}

export function initTheme() {
  applyTheme(getPreferredTheme());
}

export function toggleTheme() {
  const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
  localStorage.setItem(STORAGE_KEY, next);
  applyTheme(next);
  return next;
}

export function currentTheme() {
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

// Apply immediately (before paint) if this module is loaded early.
initTheme();
