const express = require('express');
const router = express.Router();
const Commercant = require('../models/commercants');
const Transaction = require('../models/transactions');
const Employe = require("../models/employes");

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

// async function testIban(tpe) {
//     return Commercant.findOne({
//         tpe: tpe
//     }).then(res => res.ibanCommercant);
// }

// const debitEmploye = (id, montant, refTransaction) => {
//     console.log('debitEmploye');
//     Employe.findById({
//             _id: id
//         })
//         .exec()
//         .then(employe => {
//             employe.transactions.push(refTransaction);
//             employe.soldeTotal -= montant;
//             employe.soldeJour -= montant;
//             employe.save(err => {
//                 if (err) return handleError(err);
//                 console.log(`employe ${employeSave.nom}, a été débit de ${req.body.montant}`)
//             })
//         })
// }


// async function saveTransaction(transaction) {
//     transaction.save()
//         .then(data => {
//             message.info = 'transfert effetué';
//             return {
//                 message: message,
//                 status: 'success'
//             };
//         })
//         .catch(err => {
//             message.info = 'transfert non effectué';
//             return {
//                 message: message,
//                 status: 'alert'
//             };
//             // res.redirect('transactions');
//         })
// }

router.post('/', (req, res, next) => {

    console.log('\n\n\n**************************** Transaction ****************************\n\n\n');

    // séparation de l'information contenue dans le champs tpe
    const tpeSelect = req.body.tpe.split(' - ');
    let idTransaction = '';

    // récupération du moment de la transactions
    const d = new Date(Date.now());
    const autred = d.toLocaleDateString();
    console.log(typeof (autred), autred);

    const dateMod = [
        ('0' + d.getDate()).slice(-2),
        ('0' + (d.getMonth() + 1)).slice(-2),
        d.getFullYear()
    ].join('/');

    // création de l'objet transaction avec les élements du formlaires
    const restix = encrypt(req.body.restix);
    const tpe = encrypt(tpeSelect[1]);
    const montant = encrypt(req.body.montant);
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
    console.log(transactionData);

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
                    if (employe.soldeJour >= 20) employe.soldeJour = 20;
                }

                // affectation de la date de la dernière transaction
                const dateDernierDebit = employe.dateDernierDebit;

                // debit sur le compte principal et celui du jour
                employe.soldeTotal -= req.body.montant;
                employe.soldeJour -= req.body.montant;

                // controle du débit
                if (employe.soldeTotal >= 0 && employe.soldeJour >= 0) {
                    console.log('\n\n\n ********************** solde suffisant **********************');
                    // controle de la date de la derniere transactions, si antérieur réinitialisation du solde du jour
                    if ((dateDernierDebit.getDate() < d.getDate) && (dateDernierDebit.getMonth() <= d.getMonth()) && (dateDernierDebit.getFullYear() <= d.getFullYear())) {
                        // initialisation du compte du jour
                        // employe.soldeJour = 20;
                        employe.soldeJour = employe.soldeTotal;
                        if (employe.soldeTotal >= 20) {
                            employe.soldeJour = 20;
                            employe.soldeJour -= req.body.montant;
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
                                        console.log(`employe ${employe.nom}, a été débit de ${req.body.montant}`);

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
    console.log('fonction get')
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

router.get('/list', (req, res, next) => {
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };
    Transaction.find()
        .populate('commercant')
        .populate('employe')
        .exec()
        .then(listTransactions => {
            const reponse =
                listTransactions.map(transaction => {
                    const restix = decrypt(transaction.restix);
                    const tpe = decrypt(transaction.tpe);
                    const montant = decrypt(transaction.montant);
                    const formatDate = decrypt(transaction.formatDate);
                    const iban = decrypt(transaction.iban);
                    // test si le iban existe

                    //const iban = (transaction.commercant && transaction.commercant !== "null" && transaction.commercant !== "undefined")?(transaction.commercant.ibanCommercant):('');
                    return {
                        montant: montant,
                        date: formatDate,
                        tpe: tpe,
                        restix: restix,
                        iban: iban
                    }
                })
            console.log(listTransactions);
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