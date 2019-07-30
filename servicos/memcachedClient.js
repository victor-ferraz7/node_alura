const memcached = require ('memcached');

module.exports = () => createMemcachedClient;

function createMemcachedClient(){
    let cliente = new memcached('localhost:11211', {
        retries: 10,
        retry: 10000,
        remove: true
    });
    return cliente;
}




