const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Commercant = require('../models/commercants');
const Transaction = require('../models/transactions');

// router.get('/', (req, res, next) => {
//     console.log('get');
//     res.render('transactions/index.html');
//     console.log(req.body);
// });


router.post('/', (req, res, next) => {
    // console.log('post');
    // var sel = req.get('tpe');
    // console.log('sel : ');
    // console.log(sel);
    // console.log('req.body :');
    const tpeSelect = req.body.tpe.split(' - ');
    // console.log('tpe : ' + tpeSelect[1]);
    var d = new Date(Date.now());
    // let dataFormat = '';
    dateFormat = ("0" + d.getDate()).slice(-2) + '/' + ("0" + d.getMonth()).slice(-2) + '/' + d.getFullYear();
    // dataFormat += ((d.getMonth()+1)<10)?('/0' + d.getMonth()):('/' + d.getMonth());
    // dataFormat += '/' + 
    // console.log('date : ' + dataFormat);
    var transactionData = new Transaction({
        _id: new mongoose.Types.ObjectId(),
        restix: req.body.restix,
        date: d,
        montant: req.body.montant,
        tpe: tpeSelect[1]
    });
    console.log(transactionData);

    transactionData.save()
        .then(data => {
            console.log(data);
            res.redirect('transactions');
        })
        .catch(err => {
            console.log(err);
            res.redirect('transactions');
        })


    // res.render('transactions/index.html');

});



router.get('/', (req, res, next) => {
    Commercant.find()
        .then(listCommercant => {
            let listTpe = [];
            listCommercant.forEach(element => {
                listTpe.push({
                    'tpe': element.tpe,
                    'nomCommercant': element.nomCommercant
                })
            });
            // console.log(listTpe);
            res.render('transactions/index.html', {
                listTpe: listTpe
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

router.get('/liste', (req, res, next) => {
    Transaction.find({})
        .populate('commercant')
        .then(listeTransactions => {
            // console.log(listTpe);
            console.log(listeTransactions.commercant);
            res.status(200).json(listeTransactions);
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})


module.exports = router;