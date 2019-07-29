const express = require('express');
const consign = require('consign');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');



module.exports = ()=> {
    let app = express();
   
    app.use(expressValidator()); // refatorar !
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json());
    
    

    consign()
        .include('controllers')
        .then('persistencia')
        .into(app);

    return app;
}

