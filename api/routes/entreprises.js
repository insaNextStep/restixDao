const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Entreprise = require('../models/entreprises');
const jwt = require('jsonwebtoken');

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

router.post("/loginEntreprise", (req, res, next) => {
    const logData = req.body;
    // Employee.findOne({'email': logData.email,'companyNumber': logData.companyNumber })
    Entreprise.findOne({
        email: logData.email.toLowerCase()
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

router.get('/:entrepriseId', (req, res, next) => {
    const id = req.params.entrepriseId;
    Entreprise.findById({
            _id: id
        })
        .populate('employees')
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
    var entrepriseData = new Entreprise({
        nomEntreprise: req.body.nomEntreprise,
        tel: req.body.tel,
        email: req.body.email,
        ibanEntreprise: req.body.ibanEntreprise,
        numSiret: req.body.numSiret
    });
    entrepriseData
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
});

// router.get('/', (req, res, next) => {
//     Company.find()
//         .populate(list-employees)
//         .populate(creditCardNum)
//         .select('_id eMail nom prenom codeEntreprise')
//         .exec()
//         .then(list-companies => {
//             const reponse = {
//                 "Nombre de clients": list-companies.length,
//                 Utilisateur: list-companies.map(company => {
//                     return {
//                         companyName: company.companyName,
//                         Iban: company.Iban,
//                         siret: company.siret,
//                         number: company.number,
//                         password: company.password,
//                         numberStreet: company.numberStreet,
//                         street: company.street,
//                         commune: company.commune,
//                         codePostal: company.codePostal,
//                         city: company.city,
//                         name: company.name,
//                         lastName: company.lastName,
//                         phone: company.phone,
//                         eMail: company.eMail,
//                         creditCardNum: company.creditCardNum,
//                         list-employees: company.list-employees,
//                         url: 'http://localhost:3000/companies/' + company._id
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
//     console.log(req.body);
//     const entrepriseData = new Company({
//         _id: new mongoose.Types.ObjectId(),
//         companyName: req.body.companyName,
//         Iban: req.body.Iban,
//         siret: req.body.siret,
//         number: req.body.number,
//         password: req.body.password,
//         numberStreet: req.body.numberStreet,
//         street: req.body.street,
//         commune: req.body.commune,
//         codePostal: req.body.codePostal,
//         city: req.body.city,
//         name: req.body.name,
//         lastName:req.body.lastName,
//         phone: req.body.phone,
//         eMail:req.body.eMail,
//         creditCardNum: req.body.creditCardNum,
//         list-employees: req.body.list-employees
//     });
//     console.log(req.body);
//     entrepriseData.save()
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