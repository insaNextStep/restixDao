const mongoose = require('mongoose');

const commercantSchema = new mongoose.Schema({
    nomCommercant: {
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
    tpe: {
        type: Number,
        required: true,
        unique: true
    },
    role: {
        type: String,
        required: true,
        default: 'COMMERCANT'
    },
    siretCommercant: {
        type: Number,
        required: true,
    },
    ibanCommercant: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        default: 'insa'
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
});

//exportation du modèle
module.exports = mongoose.model('Commercant', commercantSchema);
