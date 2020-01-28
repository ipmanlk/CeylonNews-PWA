// 1. Save the files to the user's device
// The "install" event is called when the ServiceWorker starts up.
// All ServiceWorker code must be inside events.
self.addEventListener('install', function (e) {
  console.log('install');

  // waitUntil tells the browser that the install event is not finished until we have
  // cached all of our files
  e.waitUntil(
    // Here we call our cache "myonsenuipwa", but you can name it anything unique
    caches.open('ceylonnewspwa').then(cache => {
      // If the request for any of these resources fails, _none_ of the resources will be
      // added to the cache.
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

// 2. Intercept requests and return the cached version instead
self.addEventListener('fetch', function (e) {
  e.respondWith(
    // check if this file exists in the cache
    caches.match(e.request)
      // Return the cached file, or else try to get it from the server
      .then(response => response || fetch(e.request))
  );
});