const http = require('http');
const app = require('./app');

//Initialisation du port d'écoute
const port = process.env.PORT || 3000;

// création du serveur
const server = http.createServer(app);

server.listen(port);