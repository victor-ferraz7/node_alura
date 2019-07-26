module.exports = (app)=>{
    app.get('/pagamentos',(req,res)=> {
        res.send('Pagamentos :)');
        console.log('Requisição na rota /pagamentos');
    });


    app.post('/pagamentos/pagamento', (req,res)=>{
        let pagamento = req.body;
        console.log('Processando uma requisição de um novo pagamento');
    
        pagamento.status = "CRIADO";
        pagamento.data = new Date;
        res.send(pagamento);
    });

}