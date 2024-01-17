const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
    _id: Number,
    name: String,
    email: String,
    password: String,
    registered_at: String,
});

module.exports = mongoose.model('Users', userSchema, 'users');