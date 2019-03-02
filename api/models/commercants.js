const mongoose = require('mongoose');

const commercantSchema = new mongoose.Schema({
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
    role: {
        type: String,
        required: true,
        default:'COMMERCANT'
    }
});
//définition du modèle
// const chopHouseSchema = new mongoose.Schema({
//     _id: mongoose.Schema.Types.ObjectId,
//     chopHouseName: { type: String, required: true },
//     Iban: { type: String, required: true },
//     siret: {type: Number, required: true},
//     Num: { type: Number, required: true },
//     password: { type: String, required: true },
//     numberStreet: {type: Number, required: true},
//     street: {type: String, required: true},
//     commune: {type: String, required: true},
//     codePostal: {type: Number, required: true},
//     city: {type: String, required: true},
//     name: { type: String, required: true },
//     lastName:{type: String, required: true},
//     phone: { type: Number, required: true },
//     eMail: { type: String, required: true, unique: true },
//     TPE:{ type: Number, required: true }
// });

//exportation du modèle
module.exports = mongoose.model('Commercant', commercantSchema);