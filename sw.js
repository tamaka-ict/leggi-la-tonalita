'use strict';
// v2.1: all application logic is embedded in index.html.
const CACHE='tonalita-v2.1.0';
const CORE=['./','./index.html','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(names=>Promise.all(names.filter(n=>n.startsWith('tonalita-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const url=new URL(event.request.url);
  if(event.request.method!=='GET'||url.origin!==location.origin)return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try{const r=await fetch(event.request);if(r.ok)cache.put(event.request,r.clone()).catch(()=>{});return r;}
    catch{return (await cache.match(event.request))||(event.request.mode==='navigate'?await cache.match('./index.html'):null)||Response.error();}
  })());
});
