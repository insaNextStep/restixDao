const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const employeeSchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        default:'INSA2019'
    },
    creditCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard',
        default: undefined
    },

});


// company: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Company',
//     default: undefined
// },

employeeSchema.virtual('company', {
    ref: 'Company',
    localField: '_id',
    foreignField: 'employees',
    justOne: true,
});

// creditCardSchema.set('toObject', {
//     virtuals: true
// });
employeeSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Employee', employeeSchema);