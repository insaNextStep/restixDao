const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const ChopHouse = require('../models/chopHouses');

// router.get('/', (req, res, next) => {
//     ChopHouse.find()
//         .exec()
//         .then(chopHouses => {
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
//     const chopHouseData = new ChopHouse({
//         _id: new mongoose.Types.ObjectId(),
//         chopHouseName: req.body.chopHouseName,
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
//         eMail: req.body.eMail,
//         TPE: req.body.TPE
//     });
//     chopHouseData.save()
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

// router.get('/:chopHouseId', (req, res, next) => {
//     const id = req.params.chopHouseId;
//     ChopHouse.findById({ _id: id }).exec()
//         .then(chopHouseData => {
//             const utilisateur = {
//                 eMail: chopHouseData.eMail,
//                 nom: chopHouseData.nom,
//                 prenom: chopHouseData.prenom,
//                 codeEntreprise: chopHouseData.codeEntreprise
//             }
//             console.log(utilisateur);
//             res.status(200).json(utilisateur)
//         })
//         .catch(err =>{
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.delete('/:chopHouseId', (req, res, next) => {
//     const id = req.params.chopHouseId;
//     ChopHouse.findById({ id: _id })
//         .remove()
//         .then(resultat => {
//             console.log('L\'objet "' + id + '" a été supprimé');
//             res.status(200).json({
//                 message: 'L\'objet "' + id + '" a été supprimé'
//             })
//         })
//         .catch(err => {
//             res.status(500).json({
//                 error: err
//             })
//         });
// });

// router.patch('/:chopHouseId', (req, res, next) => {
//     const id = req.params.chopHouseId;
//     // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
//     const updateOps = {};
//     //boucle sur l'ensemble des éléments de la page du formulaire de mise à jour
//     for (const ops of req.body) {
//         //on récupère un tableau de donnée poster sur la page web
//         updateOps[ops.propName] = ops.value;
//         /*tableau de valeur, avec un contenu au format json
//         [
//             {"propName":"name", "value":"un string"},
//             {"propName":"price", "value":"15"}
//         ]*/
//     }
//     //$set est un objet de mongoose
//     //ceci permet de mettre à jour 1 ou plusieurs éléments de la page
//     ChopHouse.update({ _id: id }, { $set: updateOps })
//         .then(result => {
//             console.log(result);
//             res.status(200).json(result);
//         })
//         .catch(err => {
//             console.log(err);
//             res.status(500).json({
//                 error: err
//             });
//         });
// });

module.exports = router;