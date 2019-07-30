const memcached = require ('memcached');

let cliente = new memcached('localhost:11211',{
    retries: 10,
    retry: 10000,
    remove: true
});

cliente.get('pagamento-20', (erro, retorno) =>{
    if (erro || !retorno){
        console.log('MISS - Chave não encontrada');
    }else{
        console.log(`HIT - valor: ${JSON.stringify(retorno)}`);
    }
});