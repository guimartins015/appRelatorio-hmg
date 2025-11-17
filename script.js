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

if(sw){

   navigator.serviceWorker.ready.then( registrar =>{

      //REGISTRAR SYNC A CADA 24HORAS
      registrar.periodicSync.register('check-scheduled-message',{minInterval: 24*60*60*1000}/*um dia*/);

   });

}