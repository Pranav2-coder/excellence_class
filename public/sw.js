self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('fetch', () => {
  // Let the browser handle standard requests to allow offline fallback if we wanted to add it later.
  // For now, this just passes through requests so the PWA is valid.
});
