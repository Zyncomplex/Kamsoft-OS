try {
  if (typeof window !== 'undefined' && typeof window.fetch === 'function') {
    Object.defineProperty(window, 'fetch', {
      value: window.fetch,
      writable: true,
      configurable: true
    });
  }
} catch (e) {
  // Ignore if fetch is read-only
}
