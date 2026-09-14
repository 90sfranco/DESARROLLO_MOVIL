const CACHE_PAGES = 'agenda-pages-v1';
const CACHE_ASSETS = 'agenda-assets-v1';
const CACHE_IMAGES = 'agenda-images-v1';
const CACHE_API = 'agenda-api-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/icon.png',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_PAGES).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cachesVigentes = [CACHE_PAGES, CACHE_ASSETS, CACHE_IMAGES, CACHE_API];

  event.waitUntil(
    caches.keys().then((nombres) =>
      Promise.all(
        nombres
          .filter((nombre) => !cachesVigentes.includes(nombre))
          .map((nombre) => caches.delete(nombre))
      )
    )
  );

  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (esHtml(request, url)) {
    event.respondWith(networkFirst(request, CACHE_PAGES));
    return;
  }

  if (esApi(request, url)) {
    event.respondWith(networkFirst(request, CACHE_API));
    return;
  }

  if (esJsOCss(request, url)) {
    event.respondWith(cacheFirst(request, CACHE_ASSETS));
    return;
  }

  if (esImagen(request, url)) {
    event.respondWith(staleWhileRevalidate(request, CACHE_IMAGES));
    return;
  }
});

function esHtml(request, url) {
  return (
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    url.pathname.endsWith('.html')
  );
}

function esJsOCss(request, url) {
  return (
    request.destination === 'script' ||
    request.destination === 'style' ||
    /\.(?:js|css)$/.test(url.pathname)
  );
}

function esImagen(request, url) {
  return (
    request.destination === 'image' ||
    /\.(?:png|jpg|jpeg|gif|webp|svg|ico)$/.test(url.pathname)
  );
}

function esApi(request, url) {
  const accept = request.headers.get('accept') || '';
  return url.pathname.startsWith('/api') || accept.includes('application/json');
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);

  try {
    const respuestaRed = await fetch(request);
    cache.put(request, respuestaRed.clone());
    return respuestaRed;
  } catch (error) {
    const respuestaCache = await cache.match(request);
    if (respuestaCache) {
      return respuestaCache;
    }

    if (request.mode === 'navigate') {
      const fallback = await cache.match('/index.html');
      if (fallback) {
        return fallback;
      }
    }

    throw error;
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const respuestaCache = await cache.match(request);

  if (respuestaCache) {
    return respuestaCache;
  }

  const respuestaRed = await fetch(request);
  cache.put(request, respuestaRed.clone());
  return respuestaRed;
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const respuestaCache = await cache.match(request);

  const actualizacionRed = fetch(request)
    .then((respuestaRed) => {
      cache.put(request, respuestaRed.clone());
      return respuestaRed;
    })
    .catch(() => undefined);

  return respuestaCache || actualizacionRed;
}
