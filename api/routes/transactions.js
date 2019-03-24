const express = require('express');
const router = express.Router();
const Commercant = require('../models/commercants');
const Transaction = require('../models/transactions');
const Employe = require("../models/employes");
const builder = require('xmlbuilder');
const fs = require('fs');

// Nodejs encryption with CTR
const crypto = require('crypto');

algorithm = 'seed-ofb',
    password = `KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZ
    *G-KaPdSgVkYp3s5v8y/B?E(H+MbQeTh
    z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbP
    6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-
    p3s6v9y$B&E)H@McQfTjWnZr4t7w!z%C`;


function encrypt(text) {
    var cipher = crypto.createCipher(algorithm, password, )
    var crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password)
    var dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}

function message(){
    alert("Hellow World");
}

function transactionXml(titre, elementJson) {
    var filePath = process.cwd();
    dateUpdate = new Date(Date.now());

    var feedObj = {
        'Document': {
            'title': titre,
            'updated': dateUpdate.toISOString(),
            'rights': 'Copyright (c) 2019, NextStep - AVENTIX',
        }
    }

    // console.log(elementJson[0]);

    feed = builder.create(feedObj, {
        encoding: 'utf-8'
    });

    var obj = element => (() => {
        // console.log(element);
        return {
            'CstmrCdtTrfInitn': {
                'PmtInf': {
                    'PmtInfId': element.id,
                    'PmtMtd': 'TRF',
                    'ReqdExctnDt': element.date.toISOString(),
                    'Dbtr': {
                        'Nm': 'AVENTIX'
                    },
                    'DbtrAcct': {
                        'Id': {
                            'IBAN': element.iban
                        }
                    },
                    'CdtTrfTxInf': {
                        'Amt': {
                            'InstdAmt': {
                                '@Ccy': 'EUR',
                                '#text': parseInt(element.montant, 10).toFixed(2)
                            }
                        }
                    }
                }
            }
        };
    });

    elementJson.forEach(element => {
        person = builder.create(obj(element));
        feed.importDocument(person);
    });

    let xmlStr = feed.end({
        pretty: true
    });

    const fileName = 'transaction.xml';
    const path = filePath + '\\' + fileName;

    fs.writeFile(path, xmlStr, function (err, data) {
        if (err) console.log(err);
        console.log("Successfully Written to File.");
    });

    // console.log(currentPath());
    // res.download(fileName);
}

router.get('/list/xml', (req, res, next) => {
    Transaction.find()
        .populate('commercant')
        .populate('employe')
        .sort({
            date: -1
        })
        .exec()
        .then(listTransactions => {
            const reponse =
                listTransactions.map(transaction => {
                    const restix = decrypt(transaction.restix);
                    const tpe = decrypt(transaction.tpe);
                    const montant = decrypt(transaction.montant);
                    const formatDate = decrypt(transaction.formatDate);
                    const iban = decrypt(transaction.iban);
                    const _id = transaction._id;
                    const date = transaction.date;
                    // test si le iban existe

                    //const iban = (transaction.commercant && transaction.commercant !== "null" && transaction.commercant !== "undefined")?(transaction.commercant.ibanCommercant):('');
                    return {
                        montant: montant,
                        formatDate: formatDate,
                        date: date,
                        dateString: date.toISOString(),
                        tpe: tpe,
                        restix: restix,
                        iban: iban,
                        _id: _id,
                        id: _id.toString()
                    }
                })
            // console.log(listTransactions[0]);

            transactionXml('Compensation adhérent AVENTIX', reponse);


            res.redirect('back');
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

    
})

router.post('/', (req, res, next) => {

    console.log('\n\n\n**************************** Transaction ****************************\n\n\n');

    // séparation de l'information contenue dans le champs tpe
    const tpeSelect = req.body.tpe.split(' - ');
    let idTransaction = '';
    console.log('info', req.body);

    // return false;

    // récupération du moment de la transactions
    const d = new Date(Date.now());
    const autred = d.toLocaleDateString();
    console.log(typeof (autred), autred);

    const dateMod = [
        ('0' + d.getDate()).slice(-2),
        ('0' + (d.getMonth() + 1)).slice(-2),
        d.getFullYear()
    ].join('/');
    var depense = req.body.montant;
    depense = Number.parseFloat(depense).toFixed(2);
    // création de l'objet transaction avec les élements du formlaires
    const restix = encrypt(req.body.restix);
    const tpe = encrypt(tpeSelect[1]);
    const montant = encrypt(depense);
    // const dateDuJour = encrypt(d);
    const formatDate = encrypt(dateMod);

    // Initialisation du tuple transactions
    var transactionData = new Transaction({
        restix: restix,
        date: d,
        formatDate: formatDate,
        montant: montant,
        tpe: tpe,
    });
    // console.log(transactionData);

    // initialisation du message pour la console
    message = {
        montant: req.body.montant,
        date: dateMod
    };

    // controle numéro restix
    Employe.findOne({
        restix: req.body.restix
    }).then(
        employe => {
            console.log(`la carte ${employe.restix}, appartient à ${employe.nom} ${employe.prenom}`);

            // initialisation code - 4 dernier chiffre carte 
            const code = employe.restix.toString().slice(-4);

            // controle de code carte:
            if (req.body.codepin === code) {
                console.log(`le code ${req.body.codepin} est correcte`)
                // controle de la 1er transaction
                if (!employe.dateDernierDebit) {
                    console.log('\n\n\n ********************** 1er transaction ********************** ');
                    employe.dateDernierDebit = d;
                    employe.soldeJour = employe.soldeTotal;
                    if (employe.soldeJour >= 21) employe.soldeJour = 21;
                }

                // affectation de la date de la dernière transaction
                const dateDernierDebit = employe.dateDernierDebit;

                // debit sur le compte principal et celui du jour
                employe.soldeTotal -= depense;
                employe.soldeJour -= depense;

                // controle du débit
                if (employe.soldeTotal >= 0 && employe.soldeJour >= 0) {
                    console.log('\n\n\n ********************** solde suffisant **********************');
                    // controle de la date de la derniere transactions, si antérieur réinitialisation du solde du jour
                    if ((dateDernierDebit.getDate() < d.getDate) && (dateDernierDebit.getMonth() <= d.getMonth()) && (dateDernierDebit.getFullYear() <= d.getFullYear())) {
                        // initialisation du compte du jour
                        // employe.soldeJour = 20;
                        employe.soldeJour = employe.soldeTotal;
                        if (employe.soldeTotal >= 21) {
                            employe.soldeJour = 21;
                            employe.soldeJour -= depense;
                        }
                    };

                    // mise à jour de la date                     
                    employe.dateDernierDebit = d;

                    // recherche de l'IBAN commercant à partir de son TPE
                    Commercant.findOne({
                        tpe: tpeSelect[1]
                    }).then(
                        commercant => {
                            // recupérer le Iban / id Commercant / id Employe du commercant:
                            transactionData.iban = encrypt(commercant.ibanCommercant);

                            // enregistrement de la transactions
                            transactionData.save()
                                .then(data => {
                                    employe.transactions.push(data._id);
                                    // enregistrement de la transaction chez l'employer
                                    employe.save(err => {
                                        if (err) return handleError(err);
                                        console.log(`employe ${employe.nom}, a été débit de ${depense}`);

                                        // enregistremnet de la transaction chez le commercant
                                        commercant.transactions.push(data._id);
                                        commercant.save(err => {
                                            if (err) return handleError(err);

                                            // information sur l'état de la transactions
                                            message.info = 'transfert effetué';

                                            // redirection sur l'état de la transactions
                                            res.render('transactions/etatTransaction.html', {
                                                message: message,
                                                status: 'success'
                                            }, function (err, html) {
                                                res.send(html);
                                            });
                                        });
                                    })
                                })
                        }
                    ).catch(err => {
                        // information sur l'état de la transactions
                        message.info = 'TPE non gérér par AVENTIX';

                        // redirection sur l'état de la transactions
                        res.render('transactions/etatTransaction.html', {
                            message: message,
                            status: 'alert'
                        }, function (err, html) {
                            res.send(html);
                        });
                    });
                } else {
                    message.info = `Votre solde est insuffisant - transaction annulé`;
                    res.render('transactions/etatTransaction.html', {
                        message: message,
                        status: 'alert'
                    }, function (err, html) {
                        res.send(html);
                    });
                }
            } else {
                message.info = `le code ${req.body.codepin} n'est pas correcte`;
                res.render('transactions/etatTransaction.html', {
                    message: message,
                    status: 'alert'
                }, function (err, html) {
                    res.send(html);
                });
            }
        }).catch(err => {
        message.info = `transfert effetué sur carte non restix`;
        res.render('transactions/etatTransaction.html', {
            message: message,
            status: 'alert'
        }, function (err, html) {
            res.send(html);
        });
    });

});

router.get('/', (req, res, next) => {
    console.log('\n\n *********************** transaction fonction get')
    // console.log(req.body);
    Commercant.find()
        .exec()
        .then(listCommercant => {
            let listTpe = [];
            listCommercant.forEach(element => {
                listTpe.push({
                    'tpe': element.tpe,
                    'nomCommercant': element.nomCommercant
                })
            });
            // console.log(listTpe);
            res.render('transactions/index.html', {
                listTpe: listTpe
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


router.get('/list', async (req, res, next) => {
    console.log('\n\n *********************** transaction liste')
    Transaction.find()
        .populate('commercant')
        .populate('employe')
        .sort({
            date: -1
        })
        .exec()
        .then(listTransactions => {
            const reponse =
                listTransactions.map(transaction => {
                    const restix = decrypt(transaction.restix);
                    const tpe = decrypt(transaction.tpe);
                    const montant = decrypt(transaction.montant);
                    const formatDate = decrypt(transaction.formatDate);
                    const iban = decrypt(transaction.iban);
                    const _id = transaction._id;
                    const date = transaction.date;
                    // test si le iban existe

                    //const iban = (transaction.commercant && transaction.commercant !== "null" && transaction.commercant !== "undefined")?(transaction.commercant.ibanCommercant):('');
                    return {
                        montant: montant,
                        formatDate: formatDate,
                        date: date,
                        dateString: date.toISOString(),
                        tpe: tpe,
                        restix: restix,
                        iban: iban,
                        _id: _id,
                        id: _id.toString()
                    }
                })
            // console.log(listTransactions[0]);

            // transactionXml('Compensation adhérent AVENTIX', reponse);


            res.render('transactions/list.html', {
                listTransactions: reponse
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })


})



module.exports = router;