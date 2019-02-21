const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Company = require('../models/companies');

router.get('/', (req, res, next) => {
    Company.find({})
        .populate('employees')
        .populate('creditCards')
        .exec()
        .then(companiesListe => {
            console.log(companiesListe);
            res.status(200).json(companiesListe);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:companyId', (req, res, next) => {
    const id = req.params.companyId;
    Company.findById({
            _id: id
        })
        .populate('employees')
        .populate('creditCards')
        .exec()
        .then(companyData => {
            console.log(companyData);
            res.status(200).json(companyData);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});


router.get('/name/:companyId', (req, res, next) => {
    const id = req.params.companyId;
    Company.findById({
            _id: id
        })
        .populate('employees')
        .populate('creditCards')
        .exec()
        .then(companyName => {
            console.log({company : companyName.name});
            res.status(200).json({company : companyName.name});
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.post('/', (req, res, next) => {
    var companyData = new Company({
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email,
    });
    companyData
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
//         .populate(list-list-employees)
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
//                         list-list-employees: company.list-list-employees,
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
//     const companyData = new Company({
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
//         list-list-employees: req.body.list-list-employees
//     });
//     console.log(req.body);
//     companyData.save()
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



router.delete('/:companyId', (req, res, next) => {
    const id = req.params.companyId;

    Company.findByIdAndDelete({
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

router.patch('/:companyId', (req, res, next) => {
    const id = req.params.companyId;
    // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    const updateOps = {};
    //boucle sur l'ensemble des éléments de la page du formulaire de mise à jour
    for (const ops of req.body) {
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
    Company.findById({
            _id: id
        })
        .update({
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