module.exports = (app)=>{
    app.get('/pagamentos',(req,res)=> {
        res.send('Pagamentos :)');
        console.log('Requisição na rota /pagamentos');
    })
}