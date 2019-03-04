const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');
var schemaOptions = {
    toObject: {
      virtuals: true
    }
    ,toJSON: {
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
        default:'insa'
    },
    creditCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard',
        default: undefined
    },
    role: {
        type: String,
        required: true,
        default:'EMPLOYE'
    },
    status: {
        type: String,
        enum: ['NEW', 'ACTIVE', 'CLOSE'],
        default: 'NEW',
        required: true
    }
}, schemaOptions);

employeSchema.virtual('entreprise', {
    ref: 'Entreprise',
    localField: '_id',
    foreignField: 'employes',
    justOne: true,
});

// employeSchema.set('toJSON', {
//     virtuals: true
// });

module.exports = mongoose.model('Employe', employeSchema);
