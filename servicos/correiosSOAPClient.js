const soap = require('soap');

soap.createClient('http://ws.correios.com.br/calculador/CalcPrecoPrazo.asmx?wsdl', (erro, cliente) =>{
    console.log('cliente soap criado');
    
    cliente.CalcPrazo({'nCdServico':'40010','sCepOrigem':'04101300','sCepDestino':'11750000'}, (err, resultado)=>{
        console.log(JSON.stringify(resultado));
    });
});