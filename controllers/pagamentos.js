module.exports = (app)=>{
    app.get('/pagamentos',(req,res)=> {
        res.send('Pagamentos :)');
        console.log('Requisição na rota /pagamentos');
    });

    app.post('/pagamentos/pagamento', (req,res)=> { 

        req.assert("forma_de_pagamento","Forma de pagamento é obrigatório")
                .notEmpty();
        req.assert("valor", "valor é obrigatório e deve ser um decimal")
                .notEmpty().isFloat();
        
        let erros = req.validationErrors();

        if (erros){
            console.log("Erros de validação encontrados");
            res.status(400).send(erros);                           
            return;
        }


        let pagamento = req.body;
        console.log('Processando uma requisição de um novo pagamento');
    
        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, (erro, resultado) =>{
            if(erro){
                console.log(`Erro ao inserir no banco ${erro}`);
                res.status(400).send(erro);
            }
            else {
            console.log('Pagamento Criado');
            res.json(pagamento);
            }
        });
        
    });

}