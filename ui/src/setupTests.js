// ============================================================
// Jest setup — runs before every test file
// ============================================================

import '@testing-library/jest-dom';

// ---------- matchMedia polyfill (used by responsive components)
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// ---------- IntersectionObserver polyfill (used by lazy-loading)
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}

// ---------- ResizeObserver polyfill
if (!window.ResizeObserver) {
  window.ResizeObserver = class ResizeObserver {
    constructor() {}
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// ---------- scrollTo no-op (used by Router)
if (!window.scrollTo) {
  window.scrollTo = () => {};
}

// ---------- Suppress noisy console.error from React act() during tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = (...args) => {
    const first = String(args[0] || '');
    if (
      first.includes('not wrapped in act(') ||
      first.includes('ReactDOM.render is no longer supported') ||
      first.includes('Warning: validateDOMNesting') ||
      first.includes('Warning: Each child in a list')
    ) {
      return;
    }
    originalConsoleError(...args);
  };
  console.warn = (...args) => {
    const first = String(args[0] || '');
    if (first.includes('Warning: [antd:') || first.includes('[MSW]')) {
      return;
    }
    originalConsoleWarn(...args);
  };
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// ---------- Expose current environment to tests
global.__TEST__ = true;