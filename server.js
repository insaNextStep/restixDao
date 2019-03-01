const http = require('http');
const app = require('./app');

//Initialisation du port d'écoute
const port = process.env.PORT || 3000;

var instructionsNouveauVisiteur = function(req, res) {
  res.writeHead(200);
  res.end('Salut tout le monde !');
}

// création du serveur
const server = http.Server(instructionsNouveauVisiteur);

server.listen(port);