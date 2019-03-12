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
    siretEntreprise:{
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

//exportation du modèle
module.exports = mongoose.model('Entreprise', entrepriseSchema);