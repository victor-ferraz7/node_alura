const fs = require('fs');

fs.createReadStream('imagem.png').pipe(fs.createWriteStream('imagem-com-stream.png')).on('finish', ()=>{
    console.log('Arquivo escrito com Stream');
});