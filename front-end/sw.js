const cacheName = 'btb';
const staticAssets = [
    './',
    './index.html',
    './main.js',
    './manifest.json',
    './now.json',
    './style.css'
];

this.addEventListener('install', async event => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return this.skipWaiting();
});

this.addEventListener('activate', event => {
    this.clients.claim();
})

this.addEventListener('fetch', async event => {
    const req = event.request;
    const url = new URL(req.url);

    if(url.origin === location.origin){
        event.respondWith(cacheFirst(req));
    }else{
        event.respondWith(networkAndCache(req));
    }
})

const cacheFirst = async (req) => {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    return cached || fetch(req);
}

const networkAndCache = async (req) => {
    const cache = await caches.open(cacheName);
    try {
        const fresh = await fetch(req)
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (error) {
        const cached = await cache.match(req);
        return cached;
    }
}