// GLOS Service Worker - cache phan tinh, khong cache du lieu dong (API dung POST nen tu bo qua)
const CACHE_NAME = 'glos-shell-v2';
const SHELL_FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', (event) => {
event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
event.waitUntil(caches.keys().then((names) => Promise.all(names.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
const req = event.request;
if (req.method !== 'GET') return;
event.respondWith(
caches.open(CACHE_NAME).then((cache) =>
cache.match(req).then((cached) => {
const networkFetch = fetch(req).then((res) => {
if (res && res.status === 200) cache.put(req, res.clone());
return res;
}).catch(() => cached);
return cached || networkFetch;
})
)
);
});
