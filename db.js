const DB_NAME = 'LembreteDB';
const DB_VERSION = 1;
const STORE_NAME = 'configuracoes';
const KEY = "proximaData";

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



