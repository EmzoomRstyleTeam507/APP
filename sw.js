const CACHE_NAME = 'emzoom-pwa-v2';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    'https://bcbbyfogofovgiesatuf.supabase.co/storage/v1/object/public/imagenes/icono.png'
];

// Instalar el Service Worker y almacenar en caché los archivos básicos
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Archivos cacheados para uso offline');
                return cache.addAll(urlsToCache);
            })
    );
});

// Interceptar peticiones para servir desde el caché si no hay red
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Limpiar cachés antiguos al actualizar el Service Worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
