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
        ibanCommercant: req.body.ibanCommercant,
                siretCommercant: req.body.siretCommercant,
        //         number: req.body.number,
        //         password: req.body.password,
        //         numberStreet: req.body.numberStreet,
        //         street: req.body.street,
        //         commune: req.body.commune,
        //         codePostal: req.body.codePostal,
        //         city: req.body.city,
        nomCommercant: req.body.nomCommercant,
        //         lastName:req.body.lastName,
        tel: req.body.tel,
        email: req.body.email,
                tpe: req.body.tpe
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

module.exports = router;