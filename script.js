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
          const registration = await navigator.serviceWorker.register('sw.js')
          console.log('Service Worker registrado com sucesso!');

          try{   
             // 2. Solicitar permissão de notificação (necessário para o alerta)
             const permission = await Notification.requestPermission();
            
             if (permission === 'granted') {
                 console.log('Permissão de notificação concedida.');

                 //await new Promise(resolve => setTimeout(resolve, 100));
                    
                 // 3. Registrar o evento de sync para o alerta
                 await registration.sync.register('alerta-data-futura');
                 console.log('Sync de alerta registrado. Aguardando...');
              }else{
                 console.warn('Permissão de notificação negada. O alerta não será exibido.');
              }
            }catch(notificationError){
                console.error('Erro CRÍTICO ao solicitar permissão de notificação:', notificationError);                        
            }
                
        } catch (swError) {
            // Captura erros no registro do Service Worker ou do Sync
            console.error('Falha na inicialização do Service Worker ou Background Sync:', swError);
        }

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

