const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const Employe = require("../models/employes");
const Entreprise = require("../models/entreprises");
// const CreditCard = require("../models/creditCards");
// const Commercant = require("../models/commercants");
// const Transaction = require("../models/transactions");
// Nodejs encryption with CTR

router.get("/employes", (req, res, next) => {
    res.status(200);
    res.render("jsonlist/index.html");
});

router.get("/restix", (req, res, next) => {
    res.status(200);
    res.render("jsonlist/index.html");
});

router.post("/employes", (req, res, next) => {
    console.log('\n\n\n********************** nouvel ajout employé **********************\n\n\n')

    let listejson = [];
    let liste = req.body.liste.split(";");
    liste.forEach(element => {
        listejson.push(JSON.parse(element));
    });

    listejson.forEach(element => {
        Entreprise.findOne({
                nomEntreprise: element.entreprise
            })
            .then(entreprise => {
                // intialise le nouveau employé
                const password = "insa";
                bcrypt.hash(password, saltRounds, (err, hash) => {
                    const employe = new Employe({
                        nom: element.nom,
                        prenom: element.prenom,
                        tel: element.tel,
                        restix: element.restix,
                        email: element.email,
                        password: hash
                    });

                    employe.save()
                        .then(employeSave => {
                            entreprise.employes.push(employeSave._id)
                            entreprise.save()
                                .then(entrepriseSave => console.log(`entreprise ${entrepriseSave.nomEntreprise}, a ajouter l'employé ${employeSave.nom}`))
                                .catch(err => console.log(`erreur de mise à jour ${entreprise.nomEntreprise} avec ${employeSave.nom}`));

                        })
                        .catch(err => console.log(`erreur mise à jour employe : ${employeSave.nom}`));
                });
            }).catch(err =>
                console.log("erreur identificaion entreprise : " + err)
            );
    })
    // res.status(200);
    res.render("jsonlist/index.html");
});

module.exports = router;