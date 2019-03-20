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
    tpe: {},
    iban:{
      type: String
    },
    restix: {},
    date: {
        type: Date
    },
    formatDate: {},
    montant: {},
}, schemaOptions);

transactionSchema.virtual('commercant', {
     ref: 'Commercant',
     localField: '_id',
     foreignField: 'transactions',
     justOne: true,
});

transactionSchema.virtual('employe', {
  ref: 'Employe',
  localField: '_id',
  foreignField: 'transactions',
  justOne: true,
});

//exportation du modèle
module.exports = mongoose.model('Transaction', transactionSchema);