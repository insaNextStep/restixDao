const express = require("express");
const router = express.Router();
// var mongoose = require("mongoose");
const CreditCard = require('../models/creditCards');
const Employe = require("../models/employes");
const Entreprise = require('../models/entreprises');

router.get('/', (req, res, next) => {
    CreditCard.find({})
        .populate('employe')
        .then(resultat => {
            var reponse = [];
            resultat.forEach(element => {
                if (element.employe && element.employe !== "null" && element.employe !== "undefined") {
                    reponse.push({
                        _id: element._id,
                        number: element.number,
                        status: element.status,
                        entreprise: element.entreprise.nomEntreprise,
                        entrepriseId: element.entreprise._id,
                        employe: element.employe.nom,
                        employeId: element.employe.id,
                        "url": "http://localhost:3000/creditcards/" + element._id
                    });
                } else {
                    reponse.push({
                        _id: element._id,
                        number: element.number,
                        status: element.status,
                        entreprise: element.entreprise.name,
                        entrepriseId: element.entreprise._id,
                        employe: '',
                        employeId: '',
                        "url": "http://localhost:3000/creditcards/" + element._id
                    });
                }
            });
            res.status(200).json(reponse);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    // recherche de l'entreprise a qui sera associé la carte 

    Entreprise.findOne({
            nomEntreprise: req.body.entreprise
        })
        .populate('creditCards')
        .populate('employes')
        .then(entreprise => {
            var creditCardData = new CreditCard({
                number: req.body.number,
            });
            creditCardData
                .save()
                .then(resultat => {
                    // ajout de la carte de crédit dans la table entreprise        
                    entreprise.creditCards.push(resultat._id);
                    entreprise.save(err => {
                        if (err) return handleError(err);
                    });

                    // gestion de l'employé sans carte bleu
                    Employe.find({
                            entreprise: entreprise._id,
                            creditCard: {
                                $exists: false
                            }
                        }, err => {
                            console.log('Pas d\'agent sans carte : ' + err);
                        })
                        .then(employe => {
                            // mise a jour du 1er employé sans CB
                            console.log(employe);
                            if (employe.length) {
                                employe[0].creditCard = resultat._id;
                                resultat.status = 'AFFECT';
                                resultat.save(err => {
                                    if (err) return handleError(err);
                                });
                                console.log(employe[0]);
                                employe[0].save(err => {
                                    if (err) return handleError(err);
                                });
                            }
                        });
                    console.log(resultat);
                    res.status(201).json(entreprise);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

router.get('/:creditCardId', (req, res, next) => {
    var id = req.params.creditCardId;
    CreditCard.findById({
            _id: id
        })
        .populate('entreprise')
        .populate('employe')
        .then(creditCardDate => {
            const cardData = {
                _id: creditCardDate._id,
                number: creditCardDate.number,
                status: creditCardDate.status,
                entreprise: creditCardDate.entreprise.name,
                entrepriseId: creditCardDate.entreprise._id,
                "Liste des cartes": "http://localhost:3000/creditcards/"
            };
            if (creditCardDate.employe && creditCardDate.employe !== "null" && creditCardDate.employe !== "undefined") {
                cardData.employe = creditCardDate.employe.name;
                cardData.employeId = creditCardDate.employe.id;
            } else {
                cardData.employe = '';
                cardData.employeId = '';
            }
            console.log(cardData);
            res.status(200).json(cardData);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:employeId', (req, res, next) => {
    var id = req.params.employeId;
    console.log(id);
    employe.findById({
            id: _id
        })
        .then(resultat => {
            console.log("L'objet \"" + resultat._id + '" a été supprimé');
            res.status(200).json({
                message: "L'objet \"" + resultat._id + '" a été supprimé'
            });
        })
        .catch(err => {
            console.log("impossible à supprimer");
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;