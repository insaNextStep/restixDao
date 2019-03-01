const mongoose = require('mongoose');
// const mongooseUniqueValidator = require('mongoose-unique-validator');

const companySchema = new mongoose.Schema({
    name: String,
    phone: Number,
    email: String,
    employees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee'
    }],
    creditCards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CreditCard'
    }]
});

//exportation du modèle
module.exports = mongoose.model('Company', companySchema);

// employeeSchema.plugin(mongooseUniqueValidator);
// companySchema.plugin(mongooseUniqueValidator);

//définition du modèle
// const companySchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     companyName: {
//         type: String,
//         required: true
//     },
//     Iban: {
//         type: String,
//         required: true,
//         unique: true
//     },
//     siret: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     Num: {
//         type: Number,
//         required: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     },
//     numberStreet: {
//         type: Number,
//         required: true
//     },
//     street: {
//         type: String,
//         required: true
//     },

//     codePostal: {
//         type: Number,
//         required: true
//     },
//     city: {
//         type: String,
//         required: true
//     },
//     name: {
//         type: String,
//         required: true
//     },
//     lastName: {
//         type: String,
//         required: true
//     },
//     phone: {
//         type: Number,
//         required: true
//     },
//     eMail: {
//         type: String,
//         required: true
//     },
//     creditCardNum: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'CreditCard'
//     }],
//     list-employees: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User'
//     }]
// });

