const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken'); 
// var mongoose = require("mongoose");
const Employee = require("../models/employees");
const Company = require('../models/companies');
const CreditCard = require('../models/creditCards');


router.get('/list', (req, res, next) => {
    Employee.find({})
        .populate('company')
        .populate('creditCard')
        .then(resultat => {
            res.status(200).json(resultat);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/add', (req, res, next) => {
    console.log(req.body);
    console.log(req.body.company);
    Company.findOne({
            name: req.body.company
        })
        .populate('creditCards')
        .then(company => {
            // intialise le nouveau employé
            var employeeData = new Employee({
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email,
                company: company._id
            });

            // recherche d'un CB disponible dans l'entreprise.
            var findCard = 0;
            company.creditCards.forEach(card => {
                console.log(card.status);
                if (card.status === 'NEW' && findCard === 0) {
                    // mise à jour de l'état de la CB
                    findCard = 1;
                    employeeData.creditCard = card._id;
                    CreditCard.findOneAndUpdate({
                        _id: card._id
                    }, {
                        status: 'AFFECT'
                    }, err => {
                        if (err) return handleError(err);
                    });
                }
            });
            // sauvegard de l'employé
            employeeData
                .save()
                .then(resultat => {
                    company.employees.push(resultat._id);
                    company.save(err => {
                        if (err) return handleError(err);
                    });
                    console.log(resultat);
                    res.status(201).json(resultat);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

router.post('/login', (req, res, next) => {
    const logData = req.body;
    // Employee.findOne({'email': logData.email,'companyNumber': logData.companyNumber })
    Employee.findOne({
        'email': logData.email
    }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (!user) {
                res.status(401).send('Invalide User');
            } else {
                if (user.password !== logData.password) {
                    res.status(401).send('Invalide Password');
                } else {
                    const payload = { subject : user._id};
                    const role = user.role;
                    const token = jwt.sign(payload,'secreteKey'); // la clé peut être ce qu'on veut
                    res.status(200).send({token, role});
                }
            }
        }
    });
});


router.post('/add-employe', (req, res, next) => {
    const dataBody = req.body;
    const dataToRegister = new Employee(dataBody);
    // Employee.findOne({'email': logData.email,'companyNumber': logData.companyNumber })
    Employee.findOne({
        'email': dataToRegister.email
    }, (err, user) => {
        if (err) {
            console.log(err);
        } else {
            if (!user) {
                dataToRegister.statusCompte = 'Activé';
                dataToRegister.save((error, registeredData) => {
                    if (error) {
                        console.log(error);
                    } else {
                        let payload = { subject : registeredData._id};
                        let token = jwt.sign(payload,'secreteKey'); // la clé peut être ce qu'on veut
                        res.status(200).send({token});
                    }
                })
            } else {
                res.status(401).send('Vous êtes déjà enregistré avec cette adresse mail');
            }
        }
    });
});




router.get('/email/:email', (req, res, next) => {
    var email = req.params.email;
    console.log('email recu : ');
    console.log(email);
    Employee.findOne({
        email: email
        })
        .then(employeeDate => {
            console.log(employeeDate['email']);
            // var utilisateur = {
            //     name: employeeDate.name,
            //     lastName: employeeDate.lastName,
            //     phone: employeeDate.phone,
            //     eMail: employeeDate.eMail,
            //     passWord: employeeDate.passWord,
            //     numberStreet: employeeDate.numberStreet,
            //     street: employeeDate.street,
            //     codePostal: employeeDate.codePostal,
            //     city: employeeDate.city,
            //     creditCardNum: employeeDate.creditCardNum,
            //     companyNum: employeeDate.companyNum,
            //     solde: employeeDate.solde,
            //     dailyUse: employeeDate.dailyUse,
            //     Activation: employeeDate.Activation
            // };
            // console.log(utilisateur);
            res.status(200).json(employeeDate['email']);
        })
        .catch(err => {
            console.log('error : ' + err);
            res.status(500).json({
                error: err
            });
        });
});


router.get('/edit/:employeeId', (req, res, next) => {
    var id = req.params.employeeId;
    console.log('id recu : ' + id);
    Employee.findById({
            _id: id
        })
        .populate('companyId')
        .exec()
        .then(employeeDate => {
            console.log(employeeDate);
            // var utilisateur = {
            //     name: employeeDate.name,
            //     lastName: employeeDate.lastName,
            //     phone: employeeDate.phone,
            //     eMail: employeeDate.eMail,
            //     passWord: employeeDate.passWord,
            //     numberStreet: employeeDate.numberStreet,
            //     street: employeeDate.street,
            //     codePostal: employeeDate.codePostal,
            //     city: employeeDate.city,
            //     creditCardNum: employeeDate.creditCardNum,
            //     companyNum: employeeDate.companyNum,
            //     solde: employeeDate.solde,
            //     dailyUse: employeeDate.dailyUse,
            //     Activation: employeeDate.Activation
            // };
            // console.log(utilisateur);
            res.status(200).json(employeeDate);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

// router.get("/", (req, res, next) => {
//     employee.find({})
//         .populate(creditCardNum)
//         .limit(5)
//         .select()
//         .exec()
//         .then(list-employees => {
//             var reponse = {
//                 "Nombre de client": list-employees.length,
//                 Utilisateur: list-employees.map(employee => {
//                     return {
//                         name: employee.name,
//                         lastName: employee.lastName,
//                         phone: employee.phone,
//                         eMail: employee.eMail,
//                         passWord: employee.passWord,
//                         numberStreet: employee.numberStreet,
//                         typeStreet: employee.typeStreet
//                         street: employee.street,
//                         codePostal: employee.codePostal,
//                         city: employee.city,
//                         creditCardNum: employee.creditCardNum,
//                         solde: employee.solde,
//                         dailyUse: employee.dailyUse,
//                         Activation: employee.Activation,
//                         url: "http://localhost:3000/employees/" + employee._id
//                     };
//                 })
//             };
//             console.log(reponse);
//             res.status(200).json(reponse);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// router.post('/', (req, res, next) => {
//     console.log(req.body)
//     var employeeDate = new employee({
//         _id: new mongoose.Types.ObjectId(),
//         name: req.body.name,
//         lastName: req.body.lastName,
//         phone: req.body.phone,
//         eMail: req.body.eMail,
//         passWord: req.body.passWord,
//         numberStreet: req.body.numberStreet,
//         street: req.body.street,
//         codePostal: req.body.codePostal,
//         city: req.body.city,
//         creditCardNum: req.body.creditCardNum,
//         companyNum: req.body.companyNum
//     });
//     employeeDate
//         .save()
//         .then(resultat => {
//             console.log(resultat);
//             res.status(201).json(resultat);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

// router.get('/:employeeId', (req, res, next) => {
//     var id = req.params.employeeId;
//     employee.findById({
//             _id: id
//         })
//         .exec()
//         .then(employeeDate => {
//             console.log(employeeDate);
//             var utilisateur = {
//                 name: employeeDate.name,
//                 lastName: employeeDate.lastName,
//                 phone: employeeDate.phone,
//                 eMail: employeeDate.eMail,
//                 passWord: employeeDate.passWord,
//                 numberStreet: employeeDate.numberStreet,
//                 street: employeeDate.street,
//                 codePostal: employeeDate.codePostal,
//                 city: employeeDate.city,
//                 creditCardNum: employeeDate.creditCardNum,
//                 companyNum: employeeDate.companyNum,
//                 solde: employeeDate.solde,
//                 dailyUse: employeeDate.dailyUse,
//                 Activation: employeeDate.Activation
//             };
//             console.log(utilisateur);
//             res.status(200).json(utilisateur);
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             });
//         });
// });


router.get('/dissocierEmploye/:employeeId', (req, res, next) => {
    const employeeId = req.params.employeeId;

    Employee.findById({
            _id: employeeId
        })
        .populate('company')
        .then(employeeData => {
            const companyId = employeeData.company._id;

            Company.findById({
                    _id: companyId
                })
                .then(companyData => {
                    console.log('2e étape');
                    // rechercher l'id dans la table d'employés dans compagnie
                    console.log('employeeId : ' + employeeId);
                    companyData.employees.splice(companyData.employees.indexOf(this.employeeId), 1);
                    companyData.save(err => {
                        if (err) return handleError(err);
                    });
                    console.log('3e étape');
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
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

// router.delete('/:employeeId', (req, res, next) => {

//     var id = req.params.employeeId;
//     employee.findById({
//             _id: id
//         })
//         .delete()
//         .then(resultat => {
//             console.log("L'objet \"" + resultat._id + '" a été supprimé');
//             res.status(200).json({
//                 message: "L'objet \"" + resultat._id + '" a été supprimé'
//             });
//         })
//         .catch(err => {
//             console.log("impossible à supprimer");
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

router.post("/edit/:employeeId", (req, res, next) => {
    var id = req.params.productId;
    // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = {};
    //boucle sur l'ensemble des éléments de la page du formulaire de mise à jour
    for (var ops of req.body) {
        //on récupère un tableau de donnée poster sur la page web
        updateOps[ops.propName] = ops.value;
        /*tableau de valeur, avec un contenu au format json
            [
                {"propName":"name", "value":"un string"},
                {"propName":"price", "value":"15"}
            ]*/
    }
    //$set est un objet de mongoose
    //ceci permet de mettre à jour 1 ou plusieurs éléments de la page
    employee
        .findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
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

module.exports = router;