const ceylonNewsCache = "ceylonNewsCacheV1";

self.addEventListener("install", (event) => {
    console.log("ServiceWorker installation successful");

    // cache initially
    event.waitUntil(
        caches.open(ceylonNewsCache).then(cache => {
            return cache.addAll([
                '/',
                '/index.html',
                '/views/newsList.html',
                '/views/newsPost.html',
                '/views/settings.html',
                '/lib/css/onsenui-core.min.css',
                '/lib/css/onsen-css-components.min.css',
                '/lib/css/material-design-iconic-font/css/material-design-iconic-font.min.css',
                '/css/custom.css',
                '/lib/js/jquery.min.js',
                '/lib/js/onsenui.min.js',
                '/lib/js/imagesloaded.pkgd.min.js',
                '/js/main.js',
                '/js/settings.js',
                '/js/navigate.js',
                '/fonts/malithi_web.ttf',
                '/manifest.json'
            ]);
        })
    );
});

self.addEventListener("activate", async (event) => {
    const keyList = await caches.keys();
    keyList.map((key) => {
        if (key !== ceylonNewsCache) {
            return caches.delete(key);
        }
    });
    console.log("ServiceWorker activation successful");
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.open(ceylonNewsCache).then((cache) => {
            return cache.match(event.request).then((cachedResponse) => {
                const cacheUrlPatterns = ["index.html", "/js/", "/lib/", "/css/", "/fonts/", "/img/", "/views/", "action=news-post"];
                let isMatch = false;
                cacheUrlPatterns.every(p => {
                    if (event.request.url.includes(p)) {
                        isMatch = true;
                        return false;
                    }
                    return true;
                });
                if (cachedResponse) {
                    //Case: A cached response already exists
                    console.log("Serving: " + event.request.url);
                    return cachedResponse;
                } else if (isMatch) {
                    //Case: A cached response doesn't exist and needs to be cached
                    //Request, cache and respond with required resource
                    return fetch(event.request).then((fetchedResponse) => {
                        console.log("Caching: " + event.request.url);
                        cache.put(event.request, fetchedResponse.clone());
                        return fetchedResponse;
                    }).catch((error) => {
                        return new Response(JSON.stringify({ status: false, serverError: "Oops! Something's up with the network connection" }));
                    });
                } else {
                    //Case: A cached response doesn't exist and no need of caching
                    //Request and respond with required resource without caching
                    return fetch(event.request).catch((error) => {
                        return new Response(JSON.stringify({ status: false, serverError: "Oops! Something's up with the network connection" }));
                    });
                }
            });
        })
    );
});