const restify = require('restify');
const clients = require('restify-clients');

let cliente = clients.createJsonClient({
    url: 'http://localhost:3001',
    version: '~1.0'
});

cliente.post('/cartoes/autoriza', (erro, req, res, retorno) =>{
    console.log(`Consumindo serviço de cartões`);  
    console.log(retorno);
});