const CACHE='dornny-v7-nospam';
self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(clients.claim());});
self.addEventListener('push',function(event){
  let data={title:'⚽ DORNNY LIVE SCORE 🇬🇭',body:'Live update!'};
  try{if(event.data) data=event.data.json();}catch{}
  event.waitUntil(self.registration.showNotification(data.title,{body:data.body,icon:'icon-192.png',badge:'icon-192.png',vibrate:[200,100,200],tag:'dornny-team-'+Date.now()}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow('/dornny-store/?v=teamnotif'));
});
self.addEventListener('fetch',e=>{});
