const express = require('express');
// const morgan = require('morgan');
const bodyParser = require('body-parser'); //analyseur de corps
const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
const cors = require('cors');
const MONGO_ATLAS_PW = "1tGTd0SBZS1MsyrX";
const MONGO_ATLAS_USER = "AJCHAHID";
// const MONGO_ATLAS_URL = "cluster0-anoo3.mongodb.net";
const nunjucks = require('nunjucks');
// var cookieParser = require("cookie-parser");

// app.use(cookieParser());
// const nunjucks = require('nunjucks'); // moteur de template

// const indexRoutes = require('./api/routes/index');
const employeRoutes = require('./api/routes/employes');
const commercantRoutes = require('./api/routes/commercants');
const entrepriseRoutes = require('./api/routes/entreprises');
const creditCardRoutes = require('./api/routes/creditcards');
const listRoutes = require('./api/routes/recuperliste')
const transactionRoutes = require('./api/routes/transactions');

//initialisation de la connexion à la base de données
const mongoDB = "mongodb+srv://" + MONGO_ATLAS_USER + ":" + MONGO_ATLAS_PW + "@cluster0-anoo3.mongodb.net/projetTransversal?retryWrites=true";
// Get Mongoose to use the global promise library
// mongoose.Promise = global.Promise;

mongoose.connect(mongoDB, {useNewUrlParser: true});


const app = express(); // astentiation d'une nouvelle application express

app.use(cors());
// app.use(morgan('dev')) ;


//analyse des données mais en mode non étendu (réduction de l'analyse)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json()); //lecture de l'information au format json

//CROS
app.use((req, res, next) => {
    // permet l'accès au site par n'importe quel origine '*' (peut etre restreint pas un adresse URL)
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    
    if (req.method === 'OPTION') {
        res.header('Access-Control-Allow-Method', 'POST, GET, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// initialisation des routes
//1er argurment indique le chemin URL /  le second indique le fichier js à utilisé ./api/routes.products.js
// app.use('/transactions', require('./api/routes/transactions'));
app.use('/employes', employeRoutes);
app.use('/commercants', commercantRoutes);
app.use('/entreprises', entrepriseRoutes);
app.use('/creditcards', creditCardRoutes);
app.use('/jsonlist', listRoutes);
app.use('/transaction', transactionRoutes);

// attraper les erreurs à partir du moment ou il n'appartiennent pas au 2 routes ci-dessous
app.use((req, res, next) => {
    const error = new Error('Pas trouvé');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    // reprise de tout les erreur sauf le code erreur 404 défini au dessus.
    // tous les autres erreur son changer en code 500
    res.status(error.status || 500);
    res.json({
        // indication du message que nous voulons....
        error: {
            message: error.message
        }
    });
});

nunjucks.configure('./api/views', {
    autoescape: true,
    express: app
});

console.log('Transaction API lancée');

module.exports = app;
