if("serviceWorker" in navigator){
    var worker = navigator.serviceWorker;
    worker.register("./sw.js")
    
    .then((reg) => {
    
      console.log("Registro de SW Bem-sucedido",reg); 
      registerPeriodicNewsCheck();     
     
    })
    .catch((err) => {
    
      console.log("Erro ao tentar registrar SW", err);
    
    });


  }else{
   console.log("Não há serviceWorker");
  }



 async function registerPeriodicNewsCheck() {

    if (!('periodicSync' in navigator.serviceWorker.ready)) {
          console.log('Periodic Background Sync não suportado.');
          return;
    }

    try {
          // Obtém o registro ativo do Service Worker
          const registration = await navigator.serviceWorker.ready;
                
          // Verifica e solicita a permissão
          const status = await navigator.permissions.query({ name: 'periodic-background-sync' });
                
          if (status.state === 'granted' || status.state === 'prompt') {
              // Registra a sincronização. A tag 'news-update' será usada no SW.
              // minInterval: 12 horas (em milissegundos) é um exemplo.
              await registration.periodicSync.register('news-update', {
                 //minInterval: 12 * 60 * 60 * 1000 
                 minInterval: 5 * 1000 
              });
              console.log('Periodic Background Sync registrado com sucesso (tag: news-update).');
              document.getElementById('status').innerText = 'Service Worker e Periodic Sync registrados.';
          } else {
               console.log('Permissão para Periodic Sync negada pelo usuário.');
          }
        } catch (err) {
            console.error('Erro ao registrar Periodic Sync:', err);
            document.getElementById('status').innerText = 'Erro ao registrar Periodic Sync.';
        }
}

/* if(sw){
   //console.log("Chegou aqui!"+navigator.serviceWorker.ready) 
   navigator.serviceWorker.ready.then( registrar =>{

      //REGISTRAR SYNC A CADA 24HORAS
      //registrar.periodicSync.register('check-scheduled-message',{minInterval: 60*1000/*24*60*60*1000*///}/*um dia*/);
      //console.log("Chegou aqui!")  


   //}); */

//}

function requestNotifyPermission(){

  if('Notification' in window){

     Notification.requestPermission().then(permission =>{
      
      if(permission === 'granted'){
          
         new Notification("Sucesso!",{
           body:'As notificações estão habilitadas'          
          });
      }else{
 
         console.warn('Permissão negada')

      }
     });
  }else{

    console.error('Este navegador não suuporta API de notificação');

  }
}

//EXECUTANDO 
requestNotifyPermission();
