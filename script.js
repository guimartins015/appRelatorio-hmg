if("serviceWorker" in navigator){
    
    navigator.serviceWorker.register("./sw.js")
        
    .then((reg) => {
    
      console.log("Registro de SW Bem-sucedido",reg); 
      
      //PEDE PERMISSÃO DE NOTIFICAÇÃO
      const permission = requestNotifyPermission();
      
      //REGISTRAR O SYNC DE NOTIFICAÇÃO
      registerPeriodicNewsCheck(permission);     
     
    })
    .catch((err) => {
    
      console.log("Erro ao tentar registrar SW", err);
    
    });


  }else{
   console.log("Não há serviceWorker");
  }



 async function registerPeriodicNewsCheck(permissao) {
 
   if ('serviceWorker' in navigator && 'SyncManager' in window) {
    
       try{
          const registration = await navigator.serviceWorker.register('sw.js')
          console.log('Service Worker registrado com sucesso!');

           
             if (permissao) {
                 console.log('Permissão de notificação concedida.');
                    
                 // 3. Registrar o evento de sync para o alerta
                 await registration.sync.register('alerta-data-futura');
                 console.log('Sync de alerta registrado. Aguardando...');
              }else{
                 console.warn('Permissão de notificação negada. O alerta não será exibido.');
              }                        
        } catch (swError) {
            // Captura erros no registro do Service Worker ou do Sync
            console.error('Falha na inicialização do Service Worker ou Background Sync:', swError);
        }

    } else {
        console.warn('Seu navegador não suporta Service Workers ou Background Sync.');
    }
}

async function requestNotifyPermission(){

  var retorno = false;
  if('Notification' in window){

     await Notification.requestPermission().then(permission =>{
      
      if(permission === 'granted'){
 
         retorno = true;

      }else{
 
         retorno = false;

      }
     });
  }else{

    console.error('Este navegador não suuporta API de notificação');
    retorno = false;

  }
  return retorno;
}

