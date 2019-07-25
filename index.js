let app = require('./config/custom-express.js')();

app.listen(3000,function(){
    console.log(`Servidor na porta 3000`);
});