'use strict';
// Increment this version when publishing new versions of the app.
const CACHE = 'tonalita-v2.0.0';
const CORE = ['./','./index.html','./app.js','./scale.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(name=>name.startsWith('tonalita-')&&name!==CACHE).map(name=>caches.delete(name)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{
      const response=await fetch(event.request);
      if(response.ok)cache.put(event.request,response.clone()).catch(()=>{});
      return response;
    }catch{
      return await cache.match(event.request) || (event.request.mode==='navigate' ? await cache.match('./index.html') : undefined) || Response.error();
    }
  })());
});
