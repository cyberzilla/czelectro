// ═══════════════════════════════════════════════════════════════
// CZElectro — Service Worker (Full Precache, Auto-Discovery)
// Strategy: Precache ALL files by auto-parsing index.html and
// manifest.js — zero manual file listing needed.
// Bump CACHE_VERSION after deploying changes.
// ═══════════════════════════════════════════════════════════════

const CACHE_VERSION = 'czelectro-v4';

// Only these extensions will be cached
const CACHEABLE_EXT = /\.(html|css|js|png|jpg|jpeg|gif|svg|ico|webp|woff2?|ttf|eot|json|webmanifest)$/i;

function isCacheable(req) {
    if (req.method !== 'GET') return false;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return false;
    return url.pathname.endsWith('/') || CACHEABLE_EXT.test(url.pathname);
}

// ─── Install ────────────────────────────────────────────────────
// Auto-discover and precache ALL project files so subsequent
// loads are 100% from cache — zero network, zero blink.

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(precacheAll());
});

async function precacheAll() {
    const cache = await caches.open(CACHE_VERSION);
    const urls = new Set();

    // ── 1. Fetch & cache index.html ──
    try {
        const htmlResp = await fetch('./index.html');
        const html = await htmlResp.clone().text();
        await cache.put(new Request('./'), htmlResp.clone());
        await cache.put(new Request('./index.html'), htmlResp);

        // Parse all href="..." and src="..." from HTML (CSS, JS, images)
        const refRegex = /(?:href|src)=["']([^"']+\.(?:css|js|png|ico|webmanifest)(?:\?[^"']*)?)["']/gi;
        let m;
        while ((m = refRegex.exec(html)) !== null) {
            const u = m[1];
            if (!u.startsWith('http') && !u.startsWith('//') && !u.startsWith('data:')) {
                // Normalize: strip query string, ensure ./ prefix
                urls.add('./' + u.replace(/^\.\//, '').replace(/\?.*$/, ''));
            }
        }
    } catch (e) {
        console.warn('[SW] Failed to parse index.html for precache:', e);
    }

    // ── 2. Fetch manifest.js to discover component files ──
    try {
        const manifestResp = await fetch('./js/components/manifest.js');
        const manifestText = await manifestResp.clone().text();
        await cache.put(new Request('./js/components/manifest.js'), manifestResp);

        const fileRegex = /file:\s*['"]([^'"]+)['"]/g;
        let m;
        while ((m = fileRegex.exec(manifestText)) !== null) {
            urls.add('./js/components/' + m[1]);
        }
    } catch (e) {
        console.warn('[SW] Failed to parse manifest.js for precache:', e);
    }

    // ── 3. Add known static assets ──
    urls.add('./manifest.webmanifest');
    [72, 96, 128, 144, 152, 192, 384, 512].forEach(s =>
        urls.add(`./icon/icon-${s}x${s}.png`)
    );

    // ── 4. Precache all discovered URLs in parallel ──
    const results = await Promise.allSettled(
        [...urls].map(url =>
            fetch(url).then(resp => {
                if (resp && resp.ok) return cache.put(new Request(url), resp);
            })
        )
    );

    const ok = results.filter(r => r.status === 'fulfilled').length;
    console.log(`[SW] Precached ${ok}/${urls.size} files`);
}

// ─── Activate ───────────────────────────────────────────────────
// Purge old caches & enable navigation preload.

self.addEventListener('activate', event => {
    event.waitUntil(
        Promise.all([
            caches.keys().then(keys =>
                Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k)))
            ),
            self.registration.navigationPreload &&
                self.registration.navigationPreload.enable()
        ]).then(() => self.clients.claim())
    );
});

// ─── Fetch ──────────────────────────────────────────────────────
// Pure cache-first: cached files return instantly, zero network.
// Cache miss → fetch from network and auto-cache for next time.

self.addEventListener('fetch', event => {
    if (!isCacheable(event.request)) return;

    if (event.request.mode === 'navigate') {
        event.respondWith(handleNavigate(event));
        return;
    }

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetchAndCache(event.request);
        })
    );
});

async function handleNavigate(event) {
    const cached = await caches.match(event.request);
    if (cached) return cached;

    try {
        const preload = await event.preloadResponse;
        if (preload) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(event.request, preload.clone());
            return preload;
        }
    } catch (e) {}

    return fetchAndCache(event.request);
}

async function fetchAndCache(request) {
    try {
        const response = await fetch(request);
        if (response && response.ok) {
            const cache = await caches.open(CACHE_VERSION);
            cache.put(request, response.clone());
        }
        return response;
    } catch (e) {
        if (request.mode === 'navigate') {
            return caches.match('./index.html');
        }
        return new Response('', { status: 408, statusText: 'Offline' });
    }
}
