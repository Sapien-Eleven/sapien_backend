const express = require('express')
const router = express.Router();
const Controller = require('./controller')

// For User Management
router.post('/signup', Controller.signup)
router.post('/login', Controller.login)
router.post('/getUsers', Controller.getUsers)
router.post('/getUserInfo', Controller.getUserInfo)
router.post('/updateUser', Controller.updateUser)
router.post('/deleteUser', Controller.deleteUser)

// For WL token gating
router.post('/getWhitelists', Controller.getWhitelists)
router.post('/addWalletAddress', Controller.addWalletAddress)
router.post('/deleteWalletAddress', Controller.deleteWalletAddress)
router.post('/updateWhitelist', Controller.updateWhitelist)
router.post('/checkWhitelistedById', Controller.checkWhitelistedById)
router.post('/checkWhitelistedByWallet', Controller.checkWhitelistedByWallet)

// For Twitter Accounts
router.post('/addXAccount', Controller.addTwitterAccout);
router.post('/getXAccounts', Controller.getTwitterAccounts);

// For Discord Accounts
router.post('/addDiscordAccount', Controller.addDiscordAccount);
router.post('/getDiscordAccounts', Controller.getDiscordAccounts);

module.exports = router;