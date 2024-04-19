const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const discordaccountSchema = new Schema({
    user_id: Number,
    username: String,
    name: String,
    email: String,
    joined_at: String,
});

module.exports = mongoose.model('DiscordAccounts', discordaccountSchema, 'discord_accounts');