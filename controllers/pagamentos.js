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

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, (erro, resultado) =>{
            console.log('Pagamento Criado')
            res.json(pagamento);
        });
        
    });

}