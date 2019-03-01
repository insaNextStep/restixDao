const express = require('express');
// const morgan = require('morgan');
const bodyParser = require('body-parser'); //analyseur de corps
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
// const nunjucks = require('nunjucks'); // moteur de template


const employeRoutes = require('./api/routes/employees');
const commercantRoutes = require('./api/routes/commercants');
const companyRoutes = require('./api/routes/companies');
const creditCardRoutes = require('./api/routes/creditcards');
const transactionRoutes = require('./api/routes/transactions');

const app = express(); // astentiation d'une nouvelle application express
app.use(cors());
// app.use(morgan('dev'));
//initialisation de la connexion à la base de données
const mongoDB = "mongodb+srv://" + process.env.MONGO_ATLAS_USER + ":" + process.env.MONGO_ATLAS_PW + "@cluster0-anoo3.mongodb.net/projetTransversal?retryWrites=true";
mongoose.connect(mongoDB, {useNewUrlParser: true});

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

// initialisation des routes
//1er argurment indique le chemin URL /  le second indique le fichier js à utilisé ./api/routes.products.js
app.use('/employees', employeRoutes);
app.use('/commercants', commercantRoutes);
app.use('/companies', companyRoutes);
app.use('/credit-cards', creditCardRoutes);
// app.use('/transaction', transactionRoutes);

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

module.exports = app;