const cluster = require('cluster');
var os = require('os')

let cpus = os.cpus();

console.log('executando thread');

if (cluster.isMaster){
    console.log('thread master');

    cpus.forEach(function(){
        cluster.fork();
    })

    cluster.on('listening', (worker) =>{
        console.log(`cluster conectado ${worker.process.pid}`);
    });

    cluster.on('exit', (worker) =>{
        console.log(`cluster ${worker.process.pid} desconectado`);
        cluster.fork();
    })
   
}else{
    console.log('thread slave');
    require('./index');
}