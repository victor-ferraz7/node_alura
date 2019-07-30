const fs = require('fs');

module.exports = (app) =>{
    app.post('/upload/imagem',(req, res) =>{
        console.log('recebendo imagem');

        let filename = req.headers.filename;

        req.pipe(fs.createWriteStream(`files/${filename}`)).on('finish', () =>{
            console.log('Arquivo escrito');
            res.status(201).send('Ok');
        })


    });
}