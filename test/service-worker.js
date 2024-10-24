// sw.js - Hospedar no GitHub Pages
const CACHE_NAME = 'pwa-apps-script-v1';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycby71JEZRqwk0Is1PBixnOA6oYtslaOGm44NVmtg04teFEBJc40_NwNAsJ8uYap5sOuQ/exec'; // Substitua pela URL do seu Apps Script

// Assets que serão cacheados
const urlsToCache = [
  SCRIPT_URL,
  'https://github.com/42nribeiro/42nribeiro.github.io/blob/main/src/icons/icon-192x192.png?raw=true',
  'https://github.com/42nribeiro/42nribeiro.github.io/blob/main/src/icons/icon-512x512.png?raw=true'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Estratégia de cache: Network First, fallback to cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Se a resposta for bem-sucedida, clone-a e armazene-a no cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });
        }
        return response;
      })
      .catch(() => {
        // Se falhar, tente buscar do cache
        return caches.match(event.request);
      })
  );
});

// Limpeza de caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
