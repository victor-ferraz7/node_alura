const restify = require('restify');
const clients = require('restify-clients');

function CartoesClient(){
    
    this._cliente = clients.createJsonClient({
        url: 'http://localhost:3001',
        version: '~1.0'
    });  
}

CartoesClient.prototype.autoriza = function(cartao,callback){
    this._cliente.post('/cartoes/autoriza',cartao,callback)
}

module.exports = () => CartoesClient;