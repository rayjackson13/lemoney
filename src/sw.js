// Minimal Service Worker to enable PWA installation
self.addEventListener('fetch', () => {
  // Required to satisfy install criteria
});

self.addEventListener("install", () => {
  self.skipWaiting(); // Activate immediately
});

self.addEventListener("activate", () => {
  clients.claim(); // Take control of all tabs
});
