
const DB_NAME = 'LembreteDB';
const DB_JA_RELAT_MES = 'JaRelatouMesDB';
const DB_VERSION = 1;
const STORE_NAME = 'configuracoes';
const STORE_JA_RELAT_MES = 'JaRelatouMesTB';
const KEY = "proximaData";
const KEY_MES_RELAT = "mes";

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
  
  //GERANDO O MES POR EXTENSO
  dateJaR = new Date();
  mesJaR = dateJaR.getMonth()-1;
  if(mesJaR==-1){
    mesJaR = 11;
  }
  var mesPorExtenso = getMesPorExtenso(mesJaR);

  //BUSCA O MES DA BASE DE DADOS 
  var mesJarelatou = await getMesjaRelatouDB();
  console.log("mes "+mesJarelatou)

  //VERIFICA SE TEM MES RELATADO
  if(typeof mesJarelatou != "undefined") 
   
  //VERIFICA SE O MES RELATADO É DIFERENTE  
  if(mesJarelatou != mesPorExtenso)   
  
  //VERIFICA SE EXISTE DATA AGENDADA NO BANCO
  if(typeof dataAgendada != "undefined"){
    console.log("Tem data "+dataAgendada);
    
     //FORMATA A DATA RECEBIDA DO BANCO
     const dataAgFormat = new Date(dataAgendada);
  
     //VERIFICA SE A DATA E HORA JÁ PASSOU 
     if(dataAtual>=dataAgFormat){
      console.log("data passou");  

        //PEGANDO A DATA E ADICIONANDO UM DIA
        dateVin = new Date();
        anoVin = dateVin.getFullYear();
        mesVin = dateVin.getMonth()+1;
        diaVin = dateVin.getDate()+1; 
        //horaVin = dateVin.getHours();
        let novaData = anoVin+"-"+mesVin+"-"+diaVin+" 13:00:00";
        //let novaData = "2025-11-18 13:00:00";

 
        try{ 
            //DATA CHEGOU EXIBIR ALERTA
            await self.registration.showNotification("Lembrete do relatório",{
              body: "Seu relatório ainda não foi enviado!",
              icon: '/images/iconeMsg.png'
            });
            
            //CHAMANDO O REAGENDADOR DE DATA
            await reagende(novaData);

        }catch (error) {
            
          console.error('[Sync] Erro ao exibir notificação:', error);
          // Se falhar (ex: erro de permissão), ainda podemos resolver o erro para evitar retries infinitos.
          return Promise.resolve();
        }

      //SE NÃO CHEGOU NA DATA CONTINUE ESPERANDO  
      }else{
        console.log("A data não chegou");
        return Promise.reject();
      }

  //SE NÃO TEM DATA NO BANCO AGENDE UMA
  }else{
        console.log("data não existe no db");
        //PEGANDO A DATA E ADICIONANDO UM DIA
        dateVin = new Date();
        anoVin = dateVin.getFullYear();
        mesVin = dateVin.getMonth()+1;
        diaVin = dateVin.getDate()+1; 
        //horaVin = dateVin.getHours();
        //let novaData = anoVin+"-"+mesVin+"-"+diaVin+" 13:00:00";
        let novaData = "2025-11-18 13:50:00";
    
        //CHAMANDO O AGENDADOR DE DATA
        reagende(novaData);

    }
}

async function reagende(newData){
  
  console.log("Agendado");

  //REAGENDA A DATA DA PROXIMA EXECUÇÃO
  setNewDataAgendadaDB(newData)
   
  //REGISTRA UM NOVO BACKGROUND SYNC PARA FICAR VERIFICANDO A DATA
  //await registration.sync.unregister('alerta-data-futura');

  console.log("Antes Registration");
  await registration.sync.register('alerta-data-futura')
  .then(() => {
      console.log('Sync de alerta re-registrado. Aguardando...');
  })
  .catch(error => {
      console.error('Erro ao re-registrar o Background Sync:', error);
  }); 
  console.log("Após Registration");
  return Promise.resolve(); 

}


function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                // Criamos um Object Store para armazenar configurações/dados simples
                // A chave primária (keyPath) não é necessária aqui, usaremos uma chave manual (ex: 'alertaData')
                db.createObjectStore(STORE_NAME); 
            }
        };

        request.onsuccess = (event) => {
            resolve(event.target.result); // Retorna o objeto IDBDatabase
        };

        request.onerror = (event) => {
            reject(new Error(`Erro ao abrir DB: ${event.target.errorCode}`));
        };
    });
}


async function getDataAgendadaDB(){
    
const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        // 'readonly' é suficiente para leitura
        const transaction = db.transaction([STORE_NAME], 'readonly');
        const store = transaction.objectStore(STORE_NAME);

        const request = store.get(KEY);

        request.onsuccess = () => {
            // O IndexedDB preserva o tipo, então se um Date foi armazenado,
            // um Date será retornado.
            resolve(request.result); 
        };

        request.onerror = (event) => {
            reject(new Error(`Falha ao obter dados: ${event.target.error}`));
        };
    });

}
async function setNewDataAgendadaDB(data){

    const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        // 'readwrite' é necessário para escrita/atualização
        const transaction = db.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        // O método 'put' adiciona ou atualiza (se a chave já existir)
        const request = store.put(data, KEY);

        request.onsuccess = () => {
            resolve(true);
        };

        request.onerror = (event) => {
            reject(new Error(`Falha ao armazenar dados: ${event.target.error}`));
        };
    });
}

async function getMesjaRelatouDB(){
    
const db = await openDatabase();
    
    return new Promise((resolve, reject) => {
        // 'readonly' é suficiente para leitura
        const transaction = db.transaction([STORE_JA_RELAT_MES], 'readonly');
        const store = transaction.objectStore(STORE_JA_RELAT_MES);

        const request = store.get(KEY_MES_RELAT);

        request.onsuccess = () => {
            // O IndexedDB preserva o tipo, então se um Date foi armazenado,
            // um Date será retornado.
            resolve(request.result); 
        };

        request.onerror = (event) => {
            reject(new Error(`Falha ao obter dados: ${event.target.error}`));
        };
    });

}
function getMesPorExtenso(numMes){
  
  let mesVingente = "";

  if(numMes=="0"){
    mesVingente = 'Janeiro'
  }else if(numMes=="1"){
    mesVingente = 'Fevereiro'
  }else if(numMes=="2"){
    mesVingente = 'Marco'
  }else if(numMes=="3"){
    mesVingente = 'Abril'
  }else if(numMes=="4"){
    mesVingente = 'Maio'
  }else if(numMes=="5"){
    mesVingente = 'Junho'
  }else if(numMes=="6"){
    mesVingente = 'Julho'
  }else if(numMes=="7"){
    mesVingente = 'Agosto'
  }else if(numMes=="8"){
    mesVingente = 'Setembro'
  }else if(numMes=="9"){
    mesVingente = 'Outubro'
  }else if(numMes=="10"){
    mesVingente = 'Novembro'
  }else if(numMes=="11"){
    mesVingente = 'Dezembro'
  }
  return mesVingente;
}