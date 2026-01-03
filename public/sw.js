
self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
});

self.addEventListener('fetch', (e) => {
    // ネットワーク優先のシンプルなフェッチハンドラー
    e.respondWith(
        fetch(e.request).catch(() => {
            return new Response('Offline');
        })
    );
});
