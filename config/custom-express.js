const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const morgan = require('morgan');
const logger = require('../servicos/logger');

module.exports = ()=> {
    let app = express();

    app.use(morgan('common',{
        stream: {
            write: (mensagem) => {
                logger.info(mensagem);
            }
        }
    }));
   
    app.use(expressValidator()); // refatorar !
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json());
    
    

    consign()
        .include('controllers')
        .then('persistencia')
        .then('servicos')
        .into(app);

    return app;
}

