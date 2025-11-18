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

self.addEventListener('sync', event => {

  if(event.tag === 'alerta-data-futura'){
    event.waitUntil(checarMsgAgendada());
  }

});

async function checarMsgAgendada() {

  // PEGA A DATA ATUAL DE HOJE
  const dataAtual = new Date();
  
  // PEGA A DATA AGENDADA PARA EXECUTAR
  const dataAgendada = await getDataAgendadaDB();


  
  //VERIFICA SE DATA AGENDADA EXISTE
  //SE NÃO EXISTIR MARCAR PARA O PROXIMO DIA AS 12:00

  //if(dataAtual>=dataAgendada){

    console.log("Data do banco "+dataAgendada);
    console.log("Data de hoje "+dataAtual);

    
    //PEGANDO A DATA E ADICIONANDO UM DIA
    dateVin = new Date();
    anoVin = dateVin.getFullYear();
    mesVin = dateVin.getMonth();
    diaVin = dateVin.getDay()+1; 
    let novaData = anoVin+"-"+mesVin+"-"+diaVin;
    
    //CHAMANDO O REAGENDADOR DE DATA
    reagende(novaData);


    /*
   try{ 
      //DATA CHEGOU EXIBIR ALERTA
      await self.registration.showNotification("Lembrete do relatório",{
         body: "Seu relatório ainda não foi enviado!",
         icon: '/images/iconeMsg.png'
      });

      //reagende();

    }catch (error) {
            
          console.error('[Sync] Erro ao exibir notificação:', error);
          // Se falhar (ex: erro de permissão), ainda podemos resolver o erro para evitar retries infinitos.
          return Promise.resolve();
    }

    //DELETAR MENSAGEM AGENDADA
    //deletar do indexedDB 
    //await deletDataAgendadaDB()
    */
  //}
  
}

function reagende(newData){
  
  //REAGENDA A DATA DA PROXIMA EXECUÇÃO
  setNewDataAgendadaDB(newData)

  //REGISTRA UM NOVO EVENTO
  registration.sync.register('alerta-data-futura')
  .then(() => {
      console.log('Sync de alerta registrado. Aguardando...');
  })
  .catch(error => {
      console.error('Erro ao registrar o Background Sync:', error);
  });
}