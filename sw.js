self.addEventListener("install", function(e) {
    e.waitUntil(
        caches.open("susara-cache").then(function(cache) {
            return cache.addAll([
                "./",
                "./index.html",
                "./manifest.json"
            ]);
        })
    );
});

self.addEventListener("fetch", function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            return response || fetch(event.request);
        })
    );
});
