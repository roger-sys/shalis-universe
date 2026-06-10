/* ==========================================
   SHAKI'S UNIVERSE - SERVICE WORKER (sw.js)
   ========================================== */

const CACHE_NAME = "shakis-universe-v2";
const ASSETS_TO_CACHE = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icon.svg"
];

// Install Event - Pre-cache essential static assets
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] Pre-caching static resources");
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// Activate Event - Clean up stale cache databases
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[Service Worker] Discarding outdated cache:", key);
                        return caches.delete(key);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Cache-first falling back to network strategy
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            
            return fetch(e.request).then((networkResponse) => {
                // Return original network response
                return networkResponse;
            }).catch(() => {
                // If network fails (and not cached), return offline placeholder or fallback if appropriate
                console.log("[Service Worker] Fetch failed, offline mode active.");
            });
        })
    );
});
