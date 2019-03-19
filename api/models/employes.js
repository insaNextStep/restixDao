const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');
var schemaOptions = {
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }
};

const employeSchema = new mongoose.Schema({
    nom: {
        type: String,
        required: true,
    },
    prenom: {
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
    password: {
        type: String,
        required: true,
        default: 'insa'
    },
    restix: {
        type: Number,
        required: true,
        default: 0
    },
    soldeTotal: {
        type: Number,
        required: true,
        default: 0
    },
    soldeJour: {
        type: Number,
        required: true,
        default: 0
    },
    dateDernierDebit: {
        type: Date,
        required: true,
        default: new Date(Date.now())
    },
    role: {
        type: String,
        required: true,
        default: 'EMPLOYE'
    },
    status: {
        type: String,
        enum: ['NEW', 'ACTIVE', 'CLOSE'],
        default: 'NEW',
        required: true
    },
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
    }],
}, schemaOptions);

employeSchema.virtual('entreprise', {
    ref: 'Entreprise',
    localField: '_id',
    foreignField: 'employes',
    justOne: true,
});

module.exports = mongoose.model('Employe', employeSchema);
