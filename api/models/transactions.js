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

const transactionSchema = new mongoose.Schema({
    tpe: {
        type: Number,
        required: true,
    },
    restix: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true,
    },
    montant: {
        type: Number,
        required: true,
    },
}, schemaOptions);

transactionSchema.virtual('commercant', {
    ref: 'Commercant',
    localField: 'tpe',
    foreignField: 'tpe',
    justOne: true,
});

transactionSchema.virtual('employe', {
    ref: 'Employe',
    localField: 'restix',
    foreignField: 'creditCard',
    justOne: true,
});


//exportation du modèle
module.exports = mongoose.model('Transaction', transactionSchema);