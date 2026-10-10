const CACHE='dornny-v6';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('push',function(event){
  let data={title:'⚽ DORNNY LIVE SCORE 🇬🇭',body:'Live update! Amansan dwaaso!'};
  try{if(event.data) data=event.data.json();}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'icon-192.png',badge:'icon-192.png',vibrate:[200,100,200],tag:'dornny-live'}));
});
self.addEventListener('notificationclick',e=>{e.notification.close();e.waitUntil(clients.openWindow('/dornny-store/'));});
self.addEventListener('fetch',e=>{});
