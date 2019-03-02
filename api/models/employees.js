const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
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