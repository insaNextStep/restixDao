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

const debitEmploye = (id, montant, refTransaction) => {
    // console.log('debitEmploye');
    Employe.findById({
            _id: id
        })
        .exec()
        .then(employe => {
            employe.transactions.push(refTransaction);
            employe.soldeTotal -= montant;
            employe.soldeJour -= montant;
            employe.save(err => {
                if (err) return handleError(err);
                // console.log(`employe ${employeSave.nom}, a été débit de ${req.body.montant}`)
            })
        })
}

async function saveTransaction(transaction) {
    transaction.save()
        .then(data => {
            message.info = 'transfert effetué';
            return {
                message: message,
                status: 'success'
            };
        })
        .catch(err => {
            message.info = 'transfert non effectué';
            return {
                message: message,
                status: 'alert'
            };
            // res.redirect('transactions');
        })
}

router.post('/', (req, res, next) => {

    // console.log('\n\n\n**************************** Transaction ****************************\n\n\n');
    // option configuration date au format france
    const options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
    };

    // séparation de l'information contenue dans le champs tpe
    const tpeSelect = req.body.tpe.split(' - ');

    // récupération du moment de la transactions
    const d = new Date(Date.now());
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
    // console.log(transactionData);
})


router.get('/', (req, res, next) => {
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
            // console.log(listTransactions);
            res.status(200).json(listTransactions);
            // res.render('transactions/list.html', {
            //     listTransactions: reponse
            // });
            // res.status(200).json(listTransactions);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


module.exports = router;