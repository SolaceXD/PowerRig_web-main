// PowerRig PWA Service Worker
const CACHE_NAME = 'powerrig-pwa-cache-v1';
const OFFLINE_URL = 'index.html';

// Files to cache for offline use
const FILES_TO_CACHE = [
    './',
    './index.html',
    './store.html',
    './aboutus.html',
    './contact.html',
    './favoriteslist.html',
    './manifest.json',
    './css/mystyle.css',
    './js/myscript.js',
    './resources/bootstrap-5.3.2-dist/bootstrap-5.3.2-dist/css/bootstrap.min.css',
    './resources/bootstrap-5.3.2-dist/bootstrap-5.3.2-dist/js/bootstrap.bundle.min.js',
    './resources/img/logo__powerrig.png',
    './resources/img/logo__powerrigblanco.png',
    './resources/img/icon-192x192.png',
    './resources/img/icon-512x512.png'
];

// Install event - cache files
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Caching all: app shell and content');
                return cache.addAll(FILES_TO_CACHE);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[ServiceWorker] Removing old cache.', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached version or fetch from network
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Check for valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    // Cache the fetched response
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
            .catch(() => {
                // If both cache and network fail, return the offline page
                return caches.match(OFFLINE_URL);
            })
    );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
