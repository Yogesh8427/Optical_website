const CACHE = 'royo-v1';
const OFFLINE_URL = '/offline.html';

const PRECACHE = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Skip non-GET, chrome-extension, and API requests
  if (request.method !== 'GET') return;
  if (url.pathname.startsWith('/api/')) return;
  if (!url.protocol.startsWith('http')) return;

  // Images — cache first (Cloudinary + local)
  if (request.destination === 'image' || url.hostname === 'res.cloudinary.com') {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        try {
          const res = await fetch(request);
          if (res.ok) cache.put(request, res.clone());
          return res;
        } catch {
          return new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  // HTML navigation — network first, fallback to offline page
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request).catch(() =>
        caches.match(OFFLINE_URL).then((r) => r ?? new Response('Offline', { status: 503 }))
      )
    );
    return;
  }

  // JS/CSS/fonts — stale while revalidate
  if (['script', 'style', 'font'].includes(request.destination)) {
    e.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const fetchPromise = fetch(request).then((res) => {
          if (res.ok) cache.put(request, res.clone());
          return res;
        }).catch(() => cached);
        return cached ?? fetchPromise;
      })
    );
  }
});
