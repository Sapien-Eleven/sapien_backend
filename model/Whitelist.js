const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const whitelistSchema = new Schema({
    wallet_address: String,
    owner: String,
    duration: Number,
    expired_at: String,
    status: Number,
    registered_at: String,
});

module.exports = mongoose.model('Whitelists', whitelistSchema, 'whitelists');