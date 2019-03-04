const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const entrepriseSchema = new mongoose.Schema({
    nomEntreprise: {
        type: String,
        required: true,
    },
    tel: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    ibanEntreprise:{
        type: String,
        required: true
    },
    numSiret:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        default: 'insa'
    },
    employes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employe'
    }],
    creditCards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard'
    }],
    role: {
        type: String,
        required: true,
        default: 'ENTREPRISE'
    },
    numRue: {
        type: Number,
    },
    rue: {
        type: String,
    },

    CP: {
        type: Number,
    },
    commune: {
        type: String,
    },
});

// définition du modèle
// const entrepriseSchema = new mongoose.Schema({
//     nomEntreprise: {
//         type: String,
//         required: true
//     },
//     ibanEntreprise: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     numSiret: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     numEntreprise: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true,
//         default: 'insa'
//     },
//     tel: {
//         type: Number,
//         required: true
//     },
//     email: {
//         type: String,
//         required: true
//     },
//     creditCards: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'CreditCard'
//     }],
//     employes: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }],
//     role: {
//         type: String,
//         required: true,
//         default: 'ENTREPRISE'
//     },
// });

//exportation du modèle
module.exports = mongoose.model('Entreprise', entrepriseSchema);