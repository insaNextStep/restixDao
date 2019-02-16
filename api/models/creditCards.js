const mongoose = require('mongoose');

// définition du modèle
const creditCardSchema = new mongoose.Schema({
    number: {
        type: Number,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['NEW', 'AFFECT', 'LOST', 'EXPIRED'],
        default: 'NEW',
        required: true
    },
});

// 1er ligne : la colonne virtuel
creditCardSchema.virtual('company', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'creditCards',
    justOne: true,
});

creditCardSchema.virtual('employee', {
    ref: 'Employee',
    localField: '_id',
    foreignField: 'creditCard',
    justOne: true,
});

// creditCardSchema.set('toObject', {
//     virtuals: true
// });
creditCardSchema.set('toJSON', {
    virtuals: true
});
//exportation du modèle
module.exports = mongoose.model('CreditCard', creditCardSchema);