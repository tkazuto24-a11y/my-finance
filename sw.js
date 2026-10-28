const CACHE='my-finance-firebase-8ffe386e1805';
const ASSETS=["./index.html", "./firebase-config.js", "./vendor/firebase-sdk.js", "./manifest.webmanifest", "./icon.svg"];

const URLS=ASSETS.map(p=>new URL(p,self.location).href),APP=URLS[0],ROOT=new URL('./',self.location).href;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(URLS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('my-finance-firebase-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.search)return;
 const key=u.href===ROOT?APP:u.href;if(!URLS.includes(key))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(key,copy)));}return r;}).catch(()=>caches.match(key)));
});
