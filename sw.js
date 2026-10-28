const CACHE='my-finance-v23-4932919d5155';
const APP=new URL('./my_finance_v2_3_onedrive.html',self.location).href;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll([APP,'./manifest.webmanifest']))));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('my-finance-v23-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 const u=new URL(e.request.url);
 // Never cache OAuth responses, Graph, tokens or OneDrive data.
 if(e.request.method!=='GET'||u.origin!==self.location.origin||u.search||u.hash)return;
 if(u.href!==APP&&!u.pathname.endsWith('/manifest.webmanifest'))return;
 e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const copy=r.clone();e.waitUntil(caches.open(CACHE).then(c=>c.put(e.request,copy)));}return r;}).catch(()=>caches.match(e.request)));
});
