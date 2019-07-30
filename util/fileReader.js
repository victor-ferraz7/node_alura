const fs = require('fs');

fs.readFile('imagem.png', (error, buffer) =>{
    console.log('arquivo lido');

    fs.writeFile('imagem2.png', buffer, (err) =>{
        console.log('arquivo escrito');
    })

});