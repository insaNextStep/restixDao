const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Commercant = require('../models/commercants');
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const saltRounds = 10;

const crypto = require('crypto');
algorithm = 'seed-ofb',
    password = `KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZ
    *G-KaPdSgVkYp3s5v8y/B?E(H+MbQeTh
    z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbP
    6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-
    p3s6v9y$B&E)H@McQfTjWnZr4t7w!z%C`;

function sortByDate(key1, key2) {
    console.log('sortByDate');
    return key2.date > key1.date;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

router.get('/list', (req, res, next) => {
    Commercant.find()
        .exec()
        .then(listCommercant => {
            //             console.log(chopHouses);
            //             const reponse = {
            //                 "Nombre de clients": chopHouses.length,
            //                 Utilisateur: chopHouses.map(chopHouse => {
            //                     return {
            //                         chopHouseName: chopHouse.chopHouseName,
            //                         url: 'http://localhost:3000/chopHouses/' + chopHouse._id
            //                     };
            //                 })
            //             };
            // console.log(listCommercant);
            res.status(200).json(listCommercant);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/add', (req, res, next) => {
    password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        var commercantData = new Commercant({
            _id: new mongoose.Types.ObjectId(),
            ibanCommercant: req.body.ibanCommercant,
            siretCommercant: req.body.siretCommercant,
            nomCommercant: req.body.nomCommercant,
            tel: req.body.tel,
            email: req.body.email,
            tpe: req.body.tpe,
            password: hash
        });
        console.log('commercantData', commercantData);
        commercantData
            .save()
            .then(resultat => {
                console.log(resultat);
                res.status(201).json(resultat);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    })
});

router.get('/email/:refEmail', (req, res, next) => {
    const email = req.params.refEmail.toLowerCase();
    console.log('node email : ' + email);
    Commercant.findOne({
            email: email
        }).exec()
        .then(data => {
            console.log('exite déjà : ' + data.email);
            res.status(200).json({
                message: 'err'
            });
        })
        .catch(err => {
            console.log('nouveau login');
            res.status(200).json({
                message: 'new'
            });
        });
});

router.get('/:commercantId', (req, res, next) => {

    const id = req.params.commercantId;
    Commercant.findOne({
            _id: id
        })
        .exec()
        .then(commercantData => {
            // const utilisateur = {
            //     eMail: commercantData.eMail,
            //     nom: commercantData.nom,
            //     prenom: commercantData.prenom,
            //     codeEntreprise: commercantData.codeEntreprise
            // }
            // console.log(commercantData);
            res.status(200).json(commercantData);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/delete/:commercantId', (req, res, next) => {
    const id = req.params.commercantId;
    Commercant.findById({
            _id: id
        })
        .remove()
        .then(resultat => {
            console.log('L\'objet "' + id + '" a été supprimé');
            res.status(200).json({
                message: 'L\'objet "' + id + '" a été supprimé'
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.patch('/update/:commercantId', (req, res, next) => {
    const id = req.params.commercantId;
    console.log('mise à jour données');
    // // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = req.body;
    Commercant
        .findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .update()
        .then(result => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/loginCommercant", (req, res, next) => {
    console.log('\n\n ************************** loginCommercant');
    const logData = req.body;
    console.log(req.body);
    // Employee.findOne({'email': logData.email,'entrepriseNumber': logData.entrepriseNumber })
    Commercant.findOne({
            email: logData.email.toLowerCase()
        })
        .then(data => {
            console.log(data);
            bcrypt.compare(logData.password, data.password, (err, resultat) => {
                if (resultat) {
                    const payload = {
                        subject: data._id,
                        nomCommercant: data.nomCommercant,
                        prenom: data.prenom,
                        email: data.email,
                        role: data.role
                    };
                    // Header: { "alg": "HS256", "typ": "JWT" }                
                    const role = data.role;
                    const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                    res.status(200).send({
                        token,
                        role
                    });
                } else {
                    res.status(500).send("Invalide Password");
                }
                if(err) {
                    console.log({erreur:  err});
                }
            })
        })
        .catch(err => {
            console.log("invalide user : " + err);
            res.status(500).send("Invalide User : " + err);
        });
});

router.get('/mesVentes/:commercantId', (req, res, next) => {
    const id = req.params.commercantId;
    Commercant.findById({
            _id: id
        })
        .populate('transactions')
        .select('transactions')
        .exec()
        .then(commercant => {
            listTransaction = commercant.transactions;
            const reponse =
                listTransaction.map(transaction => {
                    return {

                        formatDate: decrypt(transaction.formatDate),
                        refTransaction: transaction._id,
                        montant: decrypt(transaction.montant),
                        date: transaction.date
                    }

                })
            // response.sort_by(el => el.date, reverse = true);
            // console.log(autre);
            const tableau = reponse.sort(sortByDate);
            console.log(tableau);
            res.status(200).json(tableau);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;