const CACHE_NAME = 'weather-app-v2';
const STATIC_CACHE = 'weather-static-v2';
const DYNAMIC_CACHE = 'weather-dynamic-v2';
const API_CACHE = 'weather-api-v2';

const urlsToCache = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/_next/static/css/',
  '/_next/static/js/'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(urlsToCache);
      }),
      caches.open(DYNAMIC_CACHE)
    ])
  );
  self.skipWaiting();
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Suppression de l\'ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Stratégie Cache First pour les ressources statiques
  if (request.destination === 'image' || 
      url.pathname.includes('/icons/') ||
      url.pathname.includes('/manifest.json') ||
      url.pathname.includes('/_next/static/')) {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(STATIC_CACHE)
              .then((cache) => {
                cache.put(request, responseToCache);
              });
            return response;
          });
        })
    );
  }
  
  // Stratégie Network First pour les données météo avec cache intelligent
  if (url.pathname.includes('/api/weather')) {
    event.respondWith(
      caches.open(API_CACHE).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            // Retourner le cache immédiatement et mettre à jour en arrière-plan
            fetch(request).then((networkResponse) => {
              if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
              }
            }).catch(() => {});
            return cachedResponse;
          }
          
          // Pas de cache, faire la requête réseau
          return fetch(request).then((response) => {
            if (response.status === 200) {
              cache.put(request, response.clone());
            }
            return response;
          });
        });
      })
    );
  }
  
  // Stratégie Stale While Revalidate pour les autres requêtes
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }
            return networkResponse;
          });
          
          return response || fetchPromise;
        })
    );
  }
});

// Gestion des notifications push (optionnel)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-96x96.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Voir les prévisions',
          icon: '/icons/icon-96x96.png'
        },
        {
          action: 'close',
          title: 'Fermer',
          icon: '/icons/icon-96x96.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
