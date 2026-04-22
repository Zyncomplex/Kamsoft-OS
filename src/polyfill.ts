try {
  if (typeof window !== 'undefined') {
    const originalFetch = window.fetch;
    // Attempt to make fetch writable or provide a dummy setter
    // to prevent formdata-polyfill from throwing "Cannot set property fetch"
    Object.defineProperty(window, 'fetch', {
      get() { return originalFetch; },
      set(newFetch) { 
        console.warn('Blocked attempt to reassign window.fetch'); 
      },
      configurable: true
    });
  }
} catch (e) {
  // Ignore
}
