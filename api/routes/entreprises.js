const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const Entreprise = require('../models/entreprises');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const saltRounds = require('../../bcrypt').saltRounds;
const saltRounds = 10;

router.get('/list', (req, res, next) => {
    Entreprise.find({})
        .populate('employes')
        .populate('creditCards')
        .exec()
        .then(listeEntreprise => {
            console.log(listeEntreprise);
            res.status(200).json(listeEntreprise);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/getAll', (req, res, next) => {
    var email = [];
    var tpe = [];
    var iban = [];
    var siret = [];
    Entreprise.find()
        .then(listeEntreprise => {
            // listTransaction = commercant.transactions;
            listeEntreprise.map(data => {
                email.push(data.email)
            });
            listeEntreprise.map(data => {
                siret.push(data.siretEntreprise)
            });
            listeEntreprise.map(data => {
                iban.push(data.ibanEntreprise)
            });
            console.log({email: email, siret: siret, iban: iban});
            res.status(200).json({email: email, siret: siret, iban: iban});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.post("/loginEntreprise", (req, res, next) => {
    console.log('\n\n ************************** loginEntreprise');
    const logData = req.body;
    console.log(req.body);
    // Employee.findOne({'email': logData.email,'entrepriseNumber': logData.entrepriseNumber })
    Entreprise.findOne({
            email: logData.email.toLowerCase()
        })
        .then(user => {
            console.log(user);
            bcrypt.compare(logData.password, user.password, (err, resultat) => {
                if (resultat) {
                    const payload = {
                        subject: user._id,
                        role: user.role,
                        email: user.email,
                        nomEntreprise: user.nomEntreprise
                    };
                    // const payload = {
                    //     subject: user._id
                    // };
                    const role = user.role;
                    const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                    res.status(200).send({
                        token,
                        role
                    });
                } else {
                    res.status(500).send("Invalide Password");
                }
            })
        })
        .catch(err => {
            console.log("invalide user : " + err);
            res.status(500).send("Invalide User : " + err);
        });
});

router.get('/mesEmployes/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;


    Entreprise.findById({
            _id: id
        })
        .populate('employes')
        .select('employes')
        .exec()
        .then(entrepriseData => {
            console.log(entrepriseData);
            res.status(200).json(entrepriseData);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;
    Entreprise.findById({
            _id: id
        })
        .populate('employes')
        .populate('creditCards')
        .exec()
        .then(entrepriseData => {
            console.log(entrepriseData);
            res.status(200).json(entrepriseData);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/name/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;
    Entreprise.findById({
            _id: id
        })
        .exec()
        .then(entrepriseData => {
            console.log(entrepriseData.nomEntreprise);
            res.status(200).json(entrepriseData.nomEntreprise);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/add', (req, res, next) => {
    password = req.body.password;
    bcrypt.hash(password, saltRounds, (err, hash) => {
        var entrepriseData = new Entreprise({
            nomEntreprise: req.body.nomEntreprise,
            tel: req.body.tel,
            email: req.body.email,
            ibanEntreprise: req.body.ibanEntreprise,
            siretEntreprise: req.body.siretEntreprise,
            password: hash
        });
        entrepriseData
            .save()
            .then(resultat => {
                const payload = {
                    subject: resultat._id,
                    role: resultat.role,
                    email: resultat.email,
                    nomEntreprise: resultat.nomEntreprise
                };
                // const payload = {
                //     subject: resultat._id
                // };
                const role = resultat.role;
                const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                res.status(200).send({
                    token,
                    role
                });
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
    Entreprise.findOne({
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

router.delete('/delete/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;

    Entreprise.findByIdAndDelete({
            _id: id
        })
        .then(resultat => {
            // possibilité de récuperer les employer et les carte.
            console.log('L\'objet "' + id + '" a été supprimé');
            res.status(200).json({
                message: 'L\'objet "' + id + '" a été supprimé'
            });
        })
        .catch(err => {
            console.log('erreur delete');
            res.status(500).json({
                error: err
            });
        });
});

// module de cryptage de mot de passe à la volé
// router.patch('/cryptepwd/:entrepriseId', (req, res, next) => {
//             const id = req.params.entrepriseId;
//             Entreprise.findById({
//                     _id: id
//                 })
//                 .then(entrepriseData => {
//                     password = 'insa';
//                     const pwd = bcrypt.hash(password, saltRounds, (err, hash) => {
//                         entrepriseData.password = hash;
//                         entrepriseData
//                         .save()
//                         .then(resultat => {
//                             console.log(resultat);
//                             res.status(201).json(resultat);
//                         })
//                         .catch(err => {
//                             console.log(err);
//                             res.status(500).json({
//                                 error: err
//                             });
//                         });
//                     });
//                     console.log('pwd : ' + pwd);

//                 });
//             }
// )

router.patch('/update/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;
    console.log('mise à jour données');
    // // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = req.body;
    Entreprise
        .findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .update()
        .then(() => {
            Entreprise.findById({_id: id})
                .then(result => {
                    // localStorage.removeItem('currentUser');
                    const payload = {
                        subject: result._id,
                        role: result.role,
                        email: result.email,
                        nomEntreprise: result.nomEntreprise
                    };

                    console.log(payload);
                    // const payload = {
                    //     subject: result._id
                    // };
                    const role = result.role;
                    const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut

        
                    res.status(200).send({
                        token,
                        role
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;