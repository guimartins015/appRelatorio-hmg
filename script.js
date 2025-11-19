if("serviceWorker" in navigator){
    
    navigator.serviceWorker.register("./sw.js")
        
    .then((reg) => {
    
      console.log("Registro de SW Bem-sucedido",reg); 
      
      //PEDE PERMISSÃO DE NOTIFICAÇÃO
      requestNotifyPermission();
      
      //REGISTRAR O SYNC DE NOTIFICAÇÃO
      registerPeriodicNewsCheck();     
     
    })
    .catch((err) => {
    
      console.log("Erro ao tentar registrar SW", err);
    
    });


  }else{
   console.log("Não há serviceWorker");
  }



 async function registerPeriodicNewsCheck() {
 
   if ('serviceWorker' in navigator && 'SyncManager' in window) {
    
       try{
        
        await navigator.serviceWorker.register('sw.js')
        .then(async registration => {
            console.log('Service Worker registrado com sucesso!');

          try{   
            // 2. Solicitar permissão de notificação (necessário para o alerta)
            await Notification.requestPermission().then( async permission => {
                if (permission === 'granted') {
                    console.log('Permissão de notificação concedida.');

                    await new Promise(resolve => setTimeout(resolve, 100));
                    
                    // 3. Registrar o evento de sync para o alerta
                    registration.sync.register('alerta-data-futura')
                        .then(() => {
                            console.log('Sync de alerta registrado. Aguardando...');
                        })
                        .catch(error => {
                            console.error('Erro ao registrar o Background Sync:', error);
                        });
                } else {
                    console.warn('Permissão de notificação negada. O alerta não será exibido.');
                }
            });

          }catch{} 

        })
        .catch(error => {
            console.error('Falha no registro do Service Worker:', error);
        });

         }catch{}    

} else {
    console.warn('Seu navegador não suporta Service Workers ou Background Sync.');
} 
}

function requestNotifyPermission(){

  if('Notification' in window){

     Notification.requestPermission().then(permission =>{
      
      if(permission === 'granted'){
           /*
           new Notification("Sucesso!",{
            body:'As notificações estão habilitadas'          
           });
           */

      }else{
 
         console.warn('Permissão negada')

      }
     });
  }else{

    console.error('Este navegador não suuporta API de notificação');

  }
}

