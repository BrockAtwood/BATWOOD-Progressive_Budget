//unit 19 Activities #10-#13
console.log("BALLIN Service Worker is working!!!");

//Activity #13 boiler cache
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
  "/manifest.webmanifest",
  "/style.css",
];
