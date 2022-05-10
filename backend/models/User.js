const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const mongooseSanitizer = require('mongoose-sanitizer');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(mongooseSanitizer);

module.exports = mongoose.model('User', userSchema);