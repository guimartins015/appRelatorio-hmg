const CACHE_NAME="v1_cache_panel_adm",
 urlsToCache = [

    "https://guimartins015.github.io/appRelatorio-hmg/","./manifest.json"

 ];

 self.addEventListener("install",(e) => {
   e.waitUntil(
   caches
     .open(CACHE_NAME)
     .then((cache) => {
      return cache.addAll(urlsToCache).then(() => self.skipWaiting());
     })
     .catch((err) => "Falha ao registrar cache",err)
   );
 })

self.addEventListener("activate" , (e) => { 
   const cacheWitheList = [CACHE_NAME];

e.waitUntil(
  caches.keys().then((cachesNames) => 
    cachesNames.map((cacheName) => {
      if(cacheName.indexOf(cacheName)===-1){
        return caches.delete(cacheName)
      }
    })
   )
);
});

self.addEventListener("fetch",(e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      if(res){
         return res;
      }
      return fetch(e.request);
    })
  );
});

self.addEventListener('periodicsync', event => {

  if(event.tag === 'check-scheduled-message'){
    event.waitUntil(checarMsgAgendada());
  }

});

async function checarMsgAgendada() {

  //Carrega a data/titulo e body da mensagem agendada salva no indexedDB
  //cont agendaDB = await getDataAgendadaDB();

  //const dataAgendadaAlert = new Date("<DATA-definida>");
  console.log("Executou")

  if(new Date()>="2025-11-16"){

    //DATA CHEGOU EXIBIR ALERTA
    self.ServiceWorkerRegistration.showNotification("Titulo da mensagem (agendaDB.title)",{
       body: "Corpo da mensagem agendaDB.body",
       icon: '/images/iconeMsg.png'
    })

    //DELETAR MENSAGEM AGENDADA
    //deletar do indexedDB 
    //await deletDataAgendadaDB()

  }
  
}