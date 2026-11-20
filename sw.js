const CACHE='horrible-industries-v2';
const PREFIX='horrible-industries-';
const ASSETS=['./','./index.html','./styles.css','./src/data.js','./src/engine.js','./src/storage.js','./src/app.js','./assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/office.svg','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith(PREFIX)&&key!==CACHE).map(key=>caches.delete(key)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
 const request=e.request,url=new URL(request.url),scopePath=new URL(self.registration.scope).pathname;
 if(request.method!=='GET'||url.origin!==self.location.origin||!url.pathname.startsWith(scopePath))return;
 if(request.mode==='navigate'){e.respondWith(fetch(request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put('./index.html',copy)));}return r;}).catch(async()=>await caches.match('./index.html')||Response.error()));}
 else {e.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(r=>{if(r.ok){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(request,copy)));}return r;})));}
});
