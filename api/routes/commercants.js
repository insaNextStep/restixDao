const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Commercant = require('../models/commercants');



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
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

router.post('/add', (req, res, next) => {
    const commercantData = new Commercant({
        _id: new mongoose.Types.ObjectId(),
        // chopHouseName: req.body.chopHouseName,
        //         Iban: req.body.Iban,
        //         siret: req.body.siret,
        //         number: req.body.number,
        //         password: req.body.password,
        //         numberStreet: req.body.numberStreet,
        //         street: req.body.street,
        //         commune: req.body.commune,
        //         codePostal: req.body.codePostal,
        //         city: req.body.city,
        name: req.body.name,
        //         lastName:req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        //         TPE: req.body.TPE
    });
    commercantData.save()
        .then(resultat => {
            // console.log(resultat);
            res.status(201).json(resultat);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/:commercantId', (req, res, next) => {
    const id = req.params.commercantId;
    Commercant.findById({
            _id: id
        }).exec()
        .then(commercantData => {
            // const utilisateur = {
            //     eMail: commercantData.eMail,
            //     nom: commercantData.nom,
            //     prenom: commercantData.prenom,
            //     codeEntreprise: commercantData.codeEntreprise
            // }
            // console.log(commercantData);
            res.status(200).json(commercantData)
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
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
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
});

router.patch('/update/:commercantId', (req, res, next) => {
    const id = req.params.commercantId;
    console.log(req.body)
    // // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = req.body;
    // //boucle sur l'ensemble des éléments de la page du formulaire de mise à jour
    // for (var ops of req.body) {
    //     //on récupère un tableau de donnée poster sur la page web
    //     updateOps[ops.propName] = ops.value;
    //     /*tableau de valeur, avec un contenu au format json
    //         [
    //             {"propName":"name", "value":"un string"},
    //             {"propName":"price", "value":"15"}
    //         ]*/
    // }
    // console.log(updateOps);
    //$set est un objet de mongoose
    //ceci permet de mettre à jour 1 ou plusieurs éléments de la page
    Commercant
        .findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .exec()
        .then(result => {
            console.log(updateOps);
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