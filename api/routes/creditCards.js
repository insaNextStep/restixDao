const express = require("express");
const router = express.Router();
// var mongoose = require("mongoose");
const CreditCard = require('../models/creditCards');
const Employee = require("../models/employes");
const Company = require('../models/entreprises');

router.get('/', (req, res, next) => {
    CreditCard.find({})
        .populate('company')
        .populate('employee')
        .then(resultat => {
            var reponse = [];
            resultat.forEach(element => {
                if (element.employee && element.employee !== "null" && element.employee !== "undefined") {
                    reponse.push({
                        _id: element._id,
                        number: element.number,
                        status: element.status,
                        company: element.company.name,
                        companyId: element.company._id,
                        employee: element.employee.name,
                        employeeId: element.employee.id,
                        "url": "http://localhost:3000/creditcards/" + element._id
                    });
                } else {
                    reponse.push({
                        _id: element._id,
                        number: element.number,
                        status: element.status,
                        company: element.company.name,
                        companyId: element.company._id,
                        employee: '',
                        employeeId: '',
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
    Company.findOne({
            name: req.body.company
        })
        .populate('creditCards')
        .populate('employees')
        .then(company => {
            var creditCardData = new CreditCard({
                number: req.body.number,
            });


            
            creditCardData
                .save()
                .then(resultat => {
                    // ajout de la carte de crédit dans la table company        
                    company.creditCards.push(resultat._id);
                    company.save(err => {
                        if (err) return handleError(err);
                    });

                    // gestion de l'employé sans carte bleu
                    Employee.find({
                            company: company._id,
                            creditCard: {
                                $exists: false
                            }
                        }, err => {
                            console.log('Pas d\'agent sans carte');
                        })
                        .then(employee => {
                            // mise a jour du 1er employé sans CB
                            console.log(employee);
                            if (employee.length) {
                                employee[0].creditCard = resultat._id;
                                resultat.status = 'AFFECT';
                                resultat.save(err => {
                                    if (err) return handleError(err);
                                });
                                console.log(employee[0]);
                                employee[0].save(err => {
                                    if (err) return handleError(err);
                                });
                            }
                        });
                    console.log(resultat);
                    res.status(201).json(company);
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
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
//                 "Nombre de carte": list-employees.length,
//                 Utilisateur: creditcard.map(card => {
//                     return {
//                         number: card.name,
//                         status: card.status,
//                         url: "http://localhost:3000/employees/" + card._id
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

router.get('/:creditCardId', (req, res, next) => {
    var id = req.params.creditCardId;
    CreditCard.findById({
            _id: id
        })
        .populate('company')
        .populate('employee')
        .then(creditCardDate => {
            const cardData = {
                _id: creditCardDate._id,
                number: creditCardDate.number,
                status: creditCardDate.status,
                company: creditCardDate.company.name,
                companyId: creditCardDate.company._id,
                "Liste des cartes": "http://localhost:3000/creditcards/"
            };
            if (creditCardDate.employee && creditCardDate.employee !== "null" && creditCardDate.employee !== "undefined") {
                cardData.employee = creditCardDate.employee.name;
                cardData.employeeId = creditCardDate.employee.id;
            } else {
                cardData.employee = '';
                cardData.employeeId = '';
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

router.delete('/:employeeId', (req, res, next) => {
    var id = req.params.employeeId;
    console.log(id);
    employee.findById({
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
    // var id = req.params.employeeId;
    // employee.findOneAndRemove({
    //         _id: id
    //     })
    //     .exec()
    //     .then(employeeDate => {
    //         console.log('L\'objet "' + this.id + '" a été supprimé');
    //         res.status(200).json(this.id);
    //     })
    //     .catch(err => {
    //         res.status(500).json({
    //             error: err
    //         });
    //     });
});

// router.patch("/:employeeId", (req, res, next) => {
//   var id = req.params.productId;
//   // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
//   var updateOps = {};
//   //boucle sur l'ensemble des éléments de la page du formulaire de mise à jour
//   for (var ops of req.body) {
//     //on récupère un tableau de donnée poster sur la page web
//     updateOps[ops.propName] = ops.value;
//     /*tableau de valeur, avec un contenu au format json
//         [
//             {"propName":"name", "value":"un string"},
//             {"propName":"price", "value":"15"}
//         ]*/
//   }
//   //$set est un objet de mongoose
//   //ceci permet de mettre à jour 1 ou plusieurs éléments de la page
//   employee.update({
//       _id: id
//     }, {
//       $set: updateOps
//     })
//     .then(result => {
//       console.log(result);
//       res.status(200).json(result);
//     })
//     .catch(err => {
//       console.log(err);
//       res.status(500).json({
//         error: err
//       });
//     });
// });

module.exports = router;