const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
// var mongoose = require("mongoose");
const Employe = require("../models/employes");
const Entreprise = require("../models/entreprises");
const CreditCard = require("../models/creditCards");

router.get("/list", (req, res, next) => {
    Employe.find({})
    .populate('entreprise')
        .then(employesData => {
            // var reponse = employesData.map(employe => {
            //         return {
            //             nom: employe.nom,
            //             prenom: employe.prenom,
            //             phone: employe.phone,
            //             email: employe.email,
            //             entreprise: employe.entreprise.name,
            //             creditCard: employe.creditCard,
            //             url: "http://localhost:3000/employes/" + employe._id
            //         };
            //     })
            console.log(employesData);
            res.status(200).json(employesData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post("/add", (req, res, next) => {
    console.log(req.body);
    Entreprise.findOne({
        nomEntreprise: req.body.entreprise
    })
        .populate("creditCards")
        .then(entreprise => {
            console.log(entreprise._id);
            // intialise le nouveau employé
            var employeData = new Employe({
                nom: req.body.nom,
                prenom: req.body.prenom,
                tel: req.body.tel,
                email: req.body.email,
            });
            console.log(employeData);

            // recherche d'un CB disponible dans l'entreprise.
            var findCard = 0;
            entreprise.creditCards.forEach(card => {
                console.log(card.status);
                if (card.status === "NEW" && findCard === 0) {
                    // mise à jour de l'état de la CB
                    findCard = 1;
                    employeData.creditCard = card._id;
                    CreditCard.findOneAndUpdate(
                        {
                            _id: card._id
                        },
                        {
                            status: "AFFECT"
                        },
                        err => {
                            if (err) return handleError(err);
                        }
                    );
                }
            });
            // sauvegard de l'employé
            employeData
                .save()
                .then(resultat => {
                    entreprise.employes.push(resultat._id);
                    entreprise.save(err => {
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

router.get('/email/:refEmail', (req, res, next) => {
    const email = req.params.refEmail.toLowerCase();
    console.log('node email : ' + email);
    Employe.findOne({
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

router.post("/loginEmploye", (req, res, next) => {
    const logData = req.body;
    console.log("login zone");
    console.log(req.body);
    // Employee.findOne({'email': logData.email,'companyNumber': logData.companyNumber })
    Employee.findOne({
        email: logData.email
    })
        .then(user => {
            const data = user;
            console.log(data);
            console.log('user ' + data.password);
            if (data.password !== logData.password) {
                res.status(500).send("Invalide Password");
            } else {
                const payload = { subject: user._id };
                const role = user.role;
                const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                res.status(200).send({ token, role });
            }
        })
        .catch(err => {
            console.log("invalide user : " + err);
            res.status(500).send("Invalide User : " + err);
        });
});

router.post("/add-employe", (req, res, next) => {
    const dataBody = req.body;
    const dataToRegister = new Employee(dataBody);
    // Employee.findOne({'email': logData.email,'companyNumber': logData.companyNumber })
    Employe.findOne(
        {
            email: dataToRegister.email
        },
        (err, user) => {
            if (err) {
                console.log(err);
            } else {
                if (!user) {
                    dataToRegister.statusCompte = "Activé";
                    dataToRegister.save((error, registeredData) => {
                        if (error) {
                            console.log(error);
                        } else {
                            let payload = { subject: registeredData._id };
                            let token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                            res.status(200).send({ token });
                        }
                    });
                } else {
                    res.status(401).send(
                        "Vous êtes déjà enregistré avec cette adresse mail"
                    );
                }
            }
        }
    );
});

router.get("/:employeId", (req, res, next) => {
    var id = req.params.employeId;
    console.log("id recu : " + id);
    Employe.findById({
        _id: id
    })
        .populate("companyId")
        .exec()
        .then(employeDate => {
            console.log(employeDate);
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
            res.status(200).json(employeDate);
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

router.get("/dissocierEmploye/:employeId", (req, res, next) => {
    const employeId = req.params.employeId;

    Employe.findById({
        _id: employeId
    })
        .populate("company")
        .then(employeData => {
            const entrepriseId = employeData.entreprise._id;

            Company.findById({
                _id: entrepriseId
            })
                .then(entrepriseData => {
                    console.log("2e étape");
                    // rechercher l'id dans la table d'employés dans compagnie
                    console.log("employeId : " + employeId);
                    entrepriseData.employes.splice(
                        entrepriseData.employes.indexOf(this.employeId),
                        1
                    );
                    entrepriseData.save(err => {
                        if (err) return handleError(err);
                    });
                    console.log("3e étape");
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
            res.status(200).json({
                message: "L'objet \"" + id + '" a été supprimé'
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

router.patch("/update/:employeId", (req, res, next) => {
    const id = req.params.employeId;
    // // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = req.body;
    Employe
        .findOneAndUpdate({_id: id}, {$set: updateOps})
        .then(result => {
            console.log('update Ok');
            res.status(200).json({message: 'Mise à jour terminée'});
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;
