
self.addEventListener('activate', function (event) {
    console.log('activating the service worker')
})

let filesToCache = [
    '/',
    '/css/styles.css',
    '/js/main.js',
    '/js/dbhelper.js',
    '/js/restaurant_info.js',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/data/restaurants.json',
    '/index.html',
    '/restaurant.html'
];

let staticCacheName = 'pages-cache-v1';

self.addEventListener('install', function (event) {
    console.log('Attempting to install service worker and cache static assets...');
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    console.log(event.request.url);
    console.log('Fetch event for ', event.request.url);
    event.respondWith(
        caches.match(event.request).then(function (response) {
            if (response) {
                console.log('Found ', event.request.url, 'in cache');
                return response;
            }
            console.log("Network request for ", event.request.url);
            return fetch(event.request)
                .then(function (response) {
                    return caches.open(staticCacheName).then(function (cache) {
                        cache.put(event.request.url, response.clone());
                        return response;
                    })
                })

        }).catch(function (error) {
            console.log(error)
        })
    )
})