const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const xaccountSchema = new Schema({
    user_id: Number,
    username: String,
    name: String,
    email: String,
    total_points: Number,
    authorized_access: Boolean,
    joined_at: String,
});

module.exports = mongoose.model('XAccounts', xaccountSchema, 'xaccounts');