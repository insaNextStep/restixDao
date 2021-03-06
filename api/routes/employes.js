const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
// const bcrypt = require('../../bcrypt').bcrypt;
// const saltRounds = require('../../bcrypt').saltRounds;
const jwt = require("jsonwebtoken");
const Employe = require("../models/employes");
const Entreprise = require("../models/entreprises");
const Commercant = require("../models/commercants");

const crypto = require('crypto');

algorithm = 'seed-ofb',
    password = `KbPeShVmYq3s6v9y$B&E)H@McQfTjWnZ
    *G-KaPdSgVkYp3s5v8y/B?E(H+MbQeTh
    z%C*F-JaNdRgUkXp2s5u8x/A?D(G+KbP
    6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-
    p3s6v9y$B&E)H@McQfTjWnZr4t7w!z%C`;


    function sortByDate(key1, key2) {
    console.log('sortByDate');
    return key2.date > key1.date;
}

function decrypt(text) {
    var decipher = crypto.createDecipher(algorithm, password);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}

function listCommercant() {
    return Commercant.find()
        .select({
            nomCommercant: 1,
            _id: 1,
            tpe: 1
        })
        .then(res => res);
}

router.get('/getAll', (req, res, next) => {
    var email = [];
    Employe.find()
        .then(list => {
            // listTransaction = commercant.transactions;
            list.map(data => {
                email.push(data.email)
            });
            // console.log({email: email});
            res.status(200).json({email: email});
        })
        .catch(err => {
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
})

router.get("/list", (req, res, next) => {
    Employe.find({
            creditCard: {
                $exists: false
            }
        })
        .populate('entreprise')
        .then(employesData => {
            // var reponse = employesData.map(employe => {
            //     entreprise = employe.entreprise;
            //     console.log('non entreprise : ' + entreprise);
            //     return {
            //         nom: employe.nom,
            //         prenom: employe.prenom,
            //         tel: employe.tel,
            //         email: employe.email
            //     };
            // })
            res.status(200).json(employesData);
        })
        .catch(err => {
            // console.log('pas de retour positif de la base de données : ' + err)
            res.status(500).json({
                error: err
            });
        });
});

router.get('/transactions/:employeId', (req, res, next) => {
    console.log('\n\n\n**************************** liste Transaction ****************************\n\n\n');
    listCommercant().then(commercants => {
        const id = req.params.employeId;
        Employe.findById({
                _id: id
            })
            .select({
                transactions: 1
            })
            .populate('transactions')
            .then(employe => {
                listTransaction = employe.transactions;
                // console.log('list Transaction ', listTransaction);
                const reponse =
                    listTransaction.map(transaction => {
                        
                        const refTpe = decrypt(transaction.tpe);
                        // console.log('refTpe', refTpe);
                        const nomDuCommercant = commercants.find(element => {
                            return element.tpe == refTpe;
                        })

                        return {
                            formatDate: decrypt(transaction.formatDate),
                            commercant: nomDuCommercant.nomCommercant,
                            montant: decrypt(transaction.montant),
                            date: transaction.date
                        }

                    })
                // response.sort_by(el => el.date, reverse = true);
                // console.log(autre);
                // const tableau = reponse.sort(sortByDate);
                // console.log(tableau);
                res.status(200).json(reponse);
            })
            .catch(err => {
                // console.log('err : ' + err)
                res.status(500).json({
                    error: err
                });
            });
    });
})

router.post("/add", (req, res, next) => {
    // console.log('req.body', req.body);
    Entreprise.findOne({
            nomEntreprise: req.body.entreprise
        })
        .then(entreprise => {
            // intialise le nouveau employé
            const password = 'insa';
            bcrypt.hash(password, saltRounds, (err, hash) => {
                var employeData = new Employe({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    tel: req.body.tel,
                    email: req.body.email,
                    password: hash
                });
                // console.log('employeData :', employeData);

                employeData
                    .save()
                    .then(resultat => {
                        // console.log('resultat :', resultat);
                        entreprise.employes.push(resultat._id);
                        entreprise.save().then(res => {
                            res.status(201).json(resultat);
                        });
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    });
            });
        });
});

router.get('/name/:employeId', (req, res, next) => {
    const id = req.params.employeId;
    Employe.findById({
            _id: id
        })
        .exec()
        .then(employeData => {
            // console.log(employeData.nom);
            res.status(200).json(employeData.nom);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get('/email/:refEmail', (req, res, next) => {
    const email = req.params.refEmail.toLowerCase();
    console.log('email', email);
    // console.log('node email : ' + email);
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

router.get('/solde/:employeId', (req, res, next) => {
    const id = req.params.employeId;
    console.log('\n\n\n ***************** solde :')
    console.log(id);
    Employe.findById({
            _id: id
        })
        .select({soldeTotal: 1, soldeJour: 1, dateDernierDebit: 1 })
        .then(employeData => {
            // console.log('employeData', employeData);
            let dateDernierDebit = employeData.dateDernierDebit;
            const d = new Date(Date.now());
            if (!dateDernierDebit) {
                dateDernierDebit = new Date(Date.now());
                dateDernierDebit.setDate(dateDernierDebit.getDate() - 1);
            }
            // controle de la date de la derniere transactions, si antérieur réinitialisation du solde du jour
            if ((dateDernierDebit.getDate() !== d.getDate()) || !dateDernierDebit) {
                // initialisation du compte du jour
                // employe.soldeJour = 20;
                console.log('\n\n\n *************************** info hier :')
                if (!employeData.soldeTotal) {
                    employeData.soldeTotal = 0;
                }
                employeData.soldeJour = employeData.soldeTotal;
                if (employeData.soldeTotal >= 21) {
                    employeData.soldeJour = 21;
                }
                const newUser = employeData;
                newUser.save().then(res => {
                    // console.log('solde du jour mise à jour');
                });
            };            
            // console.log(employeData);
            res.status(200).json(employeData);
        })
        .catch(err => {
            res.status(500).json({
                message: err
            });
        });
});

router.post('/loginEmploye', (req, res, next) => {
    console.log('\n\n ************************** loginEmploye');
    const logData = req.body;
    // console.log(logData);
    const d = new Date(Date.now());
    // console.log('date ', d);
    Employe.findOne({
            email: logData.email.toLowerCase()
        })
        .then(data => {
            // console.log('\n\n\n *************************** mise à jour user :')
            // console.log(data);
            bcrypt.compare(logData.password, data.password, (err, resultat) => {
                if (resultat) {
                    // let dateDernierDebit = data.dateDernierDebit;
                    // if (!dateDernierDebit) {
                    //     dateDernierDebit = new Date(Date.now());
                    //     dateDernierDebit.setDate(dateDernierDebit.getDate() - 1);
                    // }
                    // // controle de la date de la derniere transactions, si antérieur réinitialisation du solde du jour
                    // if ((dateDernierDebit.getDate() !== d.getDate()) || !dateDernierDebit) {
                    //     // initialisation du compte du jour
                    //     // employe.soldeJour = 20;
                    //     console.log('\n\n\n *************************** info hier :')
                    //     if (!data.soldeTotal) {
                    //         data.soldeTotal = 0;
                    //     }
                    //     data.soldeJour = data.soldeTotal;
                    //     if (data.soldeTotal >= 20) {
                    //         data.soldeJour = 20;
                    //     }
                    //     const newUser = data;
                    //     newUser.save().then(res => {
                    //         console.log('solde du jour mise à jour');
                    //     });
                    // };
                    const payload = {
                        subject: data._id,
                        nom: data.nom,
                        restix: data.restix,
                        prenom: data.prenom,
                        email: data.email,
                        role: data.role
                    };
                    // Header: { "alg": "HS256", "typ": "JWT" }                
                    const role = data.role;
                    const token = jwt.sign(payload, "secreteKey"); // la clé peut être ce qu'on veut
                    res.status(200).send({
                        token,
                        role
                    });
                } else {
                    res.status(500).send("Invalide Password");
                }
            });
        })
        .catch(err => {
            // console.log("invalide user : " + err);
            res.status(500).send("Invalide User : " + err);
        });
})

router.get("/:employeId", (req, res, next) => {
    var id = req.params.employeId;
    // console.log("id recu : " + id);
    Employe.findById({
            _id: id
        })
        .then(employeDate => {
            // console.log(employeDate);
            res.status(200).json(employeDate);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.get("/dissocierEmploye/:employeId", (req, res, next) => {
    // console.log('dissocier :' ,  req.body);
    const employeId = req.params.employeId;
    // console.log('id', employeId);
    Employe.findById({
            _id: employeId
        })
        .populate("entreprise")
        .then(employeData => {
            const entrepriseId = employeData.entreprise._id;
            Entreprise.findById({
                    _id: entrepriseId
                })
                .then(entrepriseData => {
                    // console.log('entrepriseData', entrepriseData);
                    // rechercher l'id dans la table d'employés dans compagnie
                    entrepriseData.employes.splice(
                        entrepriseData.employes.indexOf(employeId),
                        1
                    );
                    // console.log('entrepriseData', entrepriseData);
                    entrepriseData.save(err => {
                        if (err) return handleError(err);
                        // console.log("3e étape");
                        res.status(200).json({
                            message: "L'objet \"" + employeId + '" a été retier de l\'entreprise'
                        });                        
                    });
                    // entrepriseData.save().then(res => console.log('mise à jour entreprise OK'));
                })
                .catch(err => {
                    // console.log('Erreur : ' + err);
                    res.status(500).json({
                        error: err
                    });
                });
        })
        .catch(err => {
            // console.log('Erreur Dissociation : ' + err)
            res.status(500).json({
                error: err
            });
        });
});

router.patch("/update/:employeId", (req, res, next) => {
    const id = req.params.employeId;
    // // déclaration d'une variable globale pour intégrer les élémnets de la page à mettre à jour
    var updateOps = req.body;
    Employe
        .findOneAndUpdate({
            _id: id
        }, {
            $set: updateOps
        })
        .then(() => {
            console.log('\n\n ************************  update employe  ');
            Employe.findById({_id: id})
            .then(result => {
                    // console.log('nom entreprise', result);
                    // localStorage.removeItem('currentUser');
                    const payload = {
                        subject: result._id,
                        nom: result.nom,
                        restix: result.restix,
                        prenom: result.prenom,
                        email: result.email,
                        role: result.role
                    };

                    // console.log(payload);
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
            // console.log(err);
            res.status(500).json({
                error: err
            });
        });
});

module.exports = router;