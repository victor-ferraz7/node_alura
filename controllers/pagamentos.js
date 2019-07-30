module.exports = (app)=>{
    app.get('/pagamentos',(req,res)=> {
        console.log('Requisição na rota /pagamentos');
        res.send('Ok');
    });

    app.get('/pagamentos/pagamento/:id', (req, res) => {
        let id = req.params.id;
        console.log(`consultando pagamento: ${id}`);

        let memcachedClient = app.servicos.memcachedClient();

        memcachedClient.get(`pagamento-${id}`, (erro, retorno) =>{
            if (erro || !retorno){
                console.log('MISS - Chave não encontrada');
                let connection = app.persistencia.connectionFactory();
                let pagamentoDao = new app.persistencia.PagamentoDao(connection);

                pagamentoDao.buscaPorId(id, (erro, resultado) =>{
                    if (erro){
                        console.log(`Erro ao consultar no banco: ${erro}` );
                        res.status(500).send(erro);
                        return;
                    }
                    console.log(`Pagamento encontrado: ${JSON.stringify(resultado)}`);
                    res.json(resultado);
                    return;
                });
                //hitno cache
            }else{
                console.log(`HIT - valor: ${JSON.stringify(retorno)}`);
                res.json(retorno);
                return;
            }
        });

        
    });

    app.delete('/pagamentos/pagamento/:id', (req,res) =>{
        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CANCELADO';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento,(erro) =>{
            if (erro){
              res.status(500).send(erro);
              return;
            } 
            console.log('pagamento cancelado');
            res.status(204).send(pagamento);
        });

    });

    app.put('/pagamentos/pagamento/:id', (req,res) =>{
        let pagamento = {};
        let id = req.params.id;

        pagamento.id = id;
        pagamento.status = 'CONFIRMADO';

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.atualiza(pagamento,(erro) =>{
          if (erro){
            res.status(500).send(erro);
            return;
          } 
          console.log('pagamento criado');
          res.send(pagamento);
        });

    });

    app.post('/pagamentos/pagamento', (req,res)=> { 

        req.assert("pagamento.forma_de_pagamento","Forma de pagamento é obrigatório")
                .notEmpty();
        req.assert("pagamento.valor", "valor é obrigatório e deve ser um decimal")
                .notEmpty().isFloat();
        
        let erros = req.validationErrors();

        if (erros){
            console.log("Erros de validação encontrados");
            res.status(400).send(erros);                           
            return;
        }


        let pagamento = req.body["pagamento"];
        console.log('Processando uma requisição de um novo pagamento');
    
        pagamento.status = "CRIADO";
        pagamento.data = new Date;

        let connection = app.persistencia.connectionFactory();
        let pagamentoDao = new app.persistencia.PagamentoDao(connection);

        pagamentoDao.salva(pagamento, function(erro, resultado){
            if(erro){
                console.log(`Erro ao inserir no banco ${erro}`);
                res.status(500).send(erro);
            }
            else {
            pagamento.id = resultado.insertId;
            console.log('Pagamento Criado');

            let memcachedClient = app.servicos.memcachedClient();
                memcachedClient.set(`pagamento -${pagamento.id}`, pagamento, 6000, (erro) => console.log(`nova chave adicionada ao cache: pagamento-${pagamento.id}`));

            if(pagamento.forma_de_pagamento == 'cartao'){
                let cartao = req.body['cartao'];
                console.log(cartao);

                let clienteCartoes = new app.servicos.clienteCartoes();

                    clienteCartoes.autoriza(cartao, function(exception, request, response, retorno){
                    
                        if(exception){
                            console.log(exception);
                            res.status(400).send(exception);
                            return;
                        }
                        
                        console.log(retorno);
                        
                        res.location(`/pagamentos/pagamento/${pagamento.id}`);

                        var response = {
                            dados_do_pagamento: pagamento,
                            cartao: retorno,
                            links: [
                                {
                                    href:`http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                    rel: "confirmar",
                                    method: "PUT"
                                },
                                {
                                    href:`http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                    rel: "cancelar",
                                    method: "DELETE"
                                }
                            ]
                        }

                        res.status(201).json(response);
                        return;
                });            
            }
            else {

                res.location(`/pagamentos/pagamento/${pagamento.id}`);

                    var response = {
                        dados_do_pagamento: pagamento,
                        links: [
                            {
                                href:`http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                rel: "confirmar",
                                method: "PUT"
                            },
                            {
                                href:`http://localhost:3000/pagamentos/pagamento/${pagamento.id}`,
                                rel: "cancelar",
                                method: "DELETE"
                            }
                        ]
                    }
                
                    res.status(201).json(response);
                }
            }
        });
        
    });

}