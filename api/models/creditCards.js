const mongoose = require('mongoose');


var schemaOptions = {
    toJSON: {
        virtuals: true
    }
};


// définition du modèle
const creditCardSchema = new mongoose.Schema({
    number: {
        type: Number
    },
    status: {
        type: String,
        enum: ['NEW', 'AFFECT', 'LOST', 'EXPIRED'],
        default: 'NEW'
    },
}, schemaOptions);

// 1er ligne : la colonne virtuel
creditCardSchema.virtual('entreprise', {
    ref: 'Entreprise',
    localField: '_id',
    foreignField: 'creditCards',
    justOne: true
});

creditCardSchema.virtual('employe', {
    ref: 'Employe',
    localField: '_id',
    foreignField: 'restix',
    justOne: true,
});

//exportation du modèle
module.exports = mongoose.model('CreditCard', creditCardSchema);