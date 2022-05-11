const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseSanitizer = require('mongoose-sanitizer');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator); //oblige un mail unique dans la base de donnée
userSchema.plugin(mongooseSanitizer); //désinfecte les données entrées par l'utilisteur dans les champs 

module.exports = mongoose.model('User', userSchema);