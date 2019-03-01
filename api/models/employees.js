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
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        default: undefined
    },
    creditCard: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard',
        default: undefined
    },

});

module.exports = mongoose.model('Employee', employeeSchema);