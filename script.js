var sw = false;

if("serviceWorker" in navigator){
  navigator.serviceWorker
  .register("./sw.js")
  .then((reg) => {
    
    console.log("Registro de SW Bem-sucedido",reg);
    sw = true; 
  })
  .catch((err) => {
    
    console.log("Erro ao tentar registrar SW", err);
    sw = false;
  });

  }else{
   console.log("Não há serviceWorker");
   sw = false;
}

console.log("Worker "+sw) 

if(sw){
   console.log("Chegou aqui!"+navigator.serviceWorker.ready) 
   navigator.serviceWorker.ready.then( registrar =>{

      //REGISTRAR SYNC A CADA 24HORAS
      registrar.periodicSync.register('check-scheduled-message',{minInterval: 60*1000/*24*60*60*1000*/}/*um dia*/);
      console.log("Chegou aqui!")  


   });

}

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
