//unit 19 Activities #10-#13
console.log("BALLIN Service Worker is working!!!");

//Activity #13 boiler cache
//background process, that listens for events, on a seperate thread then our main JS tread.
//varilabes used to store the names of our cache (upperCase is common practice)
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/index.js",
  "/indexedDB.js",
  "/manifest.webmanifest",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/styles.css",
];

//Unit #19 Activities #11-#13
// installation phase - cache assets - determine what files we want to cache
self.addEventListener("install", function (evt) {
  //pre cache data (1 open a cache 2 cache the files)
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Your files were pre-cached successfully!");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  //tell the browser to activate this service worker immediately once it has finished installing
  self.skipWaiting();
});

//activation phase
//manage old caches, after activating the service worker
self.addEventListener("activate", function (evt) {
  evt.waitUntil(
    //returns a promise that resolves to an array of chae keys, returned in the same order as tehy were inserted
    caches.keys().then((keyList) => {
      return Promise.all(
        //mapping over the array of cahce keys, if the key is not equal to the cache_name and the key is not equal to the data_cache_name, we remove the old cache for that key
        keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  //when the service worker is intially registered, pages wont use it until the enxt load event, teh claim method causes the pages to be controlled immead
  self.clients.claim();
});

// fetch
self.addEventListener("fetch", function (evt) {
  // cache successful requests to the API
  if (evt.request.url.includes("/api/")) {
    evt.respondWith(
      caches
        .open(DATA_CACHE_NAME)
        //open the cache, run a fetch based on whatever request comes in, attempting to fetch the resource
        .then((cache) => {
          return (
            fetch(evt.request)
              //end up here at .then if its able to fetch the resource
              .then((response) => {
                // If the response was good, clone it and store it in the cache.
                if (response.status === 200) {
                  //if good, clone and store in the cache
                  cache.put(evt.request.url, response.clone());
                }

                return response;
              })
              .catch((err) => {
                // Network request failed, try to get it from the cache.
                return cache.match(evt.request);
              })
          );
        })
        .catch((err) => console.log(err))
    );

    return;
  }

  // if the request is not for the API, serve static assets using "offline-first" approach.
  // see https://developers.google.com/web/fundamentals/instant-and-offline/offline-cookbook#cache-falling-back-to-network
  evt.respondWith(
    caches.match(evt.request).then(function (response) {
      return response || fetch(evt.request);
    })
  );
});
