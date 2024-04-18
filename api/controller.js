const Users = require("../model/User");
const Whitelists = require('../model/Whitelist');
const Counters = require('../model/Counter');
const md5 = require("md5");
const moment = require("moment");
const XAccounts = require("../model/XAccount");

exports.signup = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const wallet_address = req.body.wallet_address;
    const duration = req.body.duration;
    const password = md5(req.body.password);
    const registered_at = (new Date()).toLocaleString('en-US', {hour12: false});
    const wl_expired_at = moment().add(duration, 'days').format('DD/MM/YYYY');
    const newUser = Users({ _id: await getNextSequenceValue('users'), name, email, wallet_address, wl_expired_at, password, registered_at});
    if ((await Users.find({email}, {_id: 0, __v: 0}).exec()).length > 0) {
        res.send({
            status: 'already exists',
            comment: 'Email has already existed'
        });
    } else {
        const result = await newUser.save();
        if (result !== undefined) {
            res.send({
                status: 'success'
            })
        } else {
            res.send({
                status: 'Error Found'
            })
        }
    }
}

exports.login = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = (await Users.find({email}, {__v: 0}).exec())[0];
    if (user !== undefined) {
        if (md5(password) === user.password) {
            res.send({
                status: 'success',
                user: user
            })
        } else {
            res.send({
                status: 'wrong password',
                comment: 'Password is not matching'
            })
        }
    } else {
        res.send({
            status: 'not registered',
            comment: 'user is not registered'
        })
    }
}

exports.getUsers = async (req, res) => {
    const users = await Users.find({}, {__v: 0}).exec();
    if (users.length > 0) {
        res.send({
            status: 'success',
            users
        })
    } else {
        res.send({
            status: 'empty',
            comment: 'No user is registered'
        })
    }
}

exports.getUserInfo = async (req, res) => {
    const id = req.body.id;
    const user = (await Users.find({_id: id}, {__v: 0}).exec())[0];
    if (user !== undefined) {
        res.send({
            status: 'success',
            user
        })
    } else {
        res.send({
            status: 'not registered',
            comment: 'Please add this user'
        })
    }
}

exports.updateUser = async (req, res) => {
    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const wallet_address = req.body.wallet_address;
    const duration = req.body.duration;
    const password = req.body.password;
    let result;

    const user = await Users.findOne({_id: id}).exec();
    let wl_expired_at;
    if (!moment().isAfter(moment(user.wl_expired_at, 'DD/MM/YYYY HH:m:s').toDate(), 'day')) {
        wl_expired_at = moment(moment(user.wl_expired_at, 'DD/MM/YYYY HH:m:s').toDate()).add(duration, 'days').format('DD/MM/YYYY');
    } else {
        wl_expired_at = moment().add(duration, 'days').format('DD/MM/YYYY');
    }

    if (password === '' && wallet_address !== '') {
        result = await Users.findOneAndUpdate({_id: id}, {
            name,
            email,
            wallet_address,
            wl_expired_at
        });
    }
    else if (wallet_address === '' && password !== '') {
        result = await Users.findOneAndUpdate({_id: id}, {
            name,
            email,
            password: md5(password),
            wl_expired_at
        });
    }
    else {
        result = await Users.findOneAndUpdate({_id: id}, {
            name,
            email,
            password: md5(password),
            wl_expired_at
        });
    }
    if (result !== undefined) {
        res.send({
            status: 'success'
        })
    } else {
        res.send({
            status: 'failed',
            comment: 'Please try again'
        })
    }
}

exports.deleteUser = async (req, res) => {
    const id = req.body.id;
    const email = req.body.email;
    const result = await Users.findByIdAndDelete({_id: id, email}).exec();
    if (result !== undefined) {
        res.send({status: 'success'});
    } else {
        res.send({
            status: 'failed',
            comment: 'There is unexpected error.'
        })
    }
}

exports.addWalletAddress = async (req, res) => {
    const wallet_address = req.body.wallet_address;
    const owner = req.body.owner;
    const duration = req.body.duration;
    const registered_at = moment().format('DD/MM/YYYY HH:m:s');
    const expired_at = moment().add(duration, 'days').format('DD/MM/YYYY');
    const newWalletAddress = Whitelists({wallet_address, owner, duration, expired_at, status: 1, registered_at});
    if ((await Whitelists.find({wallet_address}, {__v: 0}).exec()).length > 0) {
        res.send({
            status: 'already existed',
            comment: 'Wallet address is already whitelisted'
        })
    } else {
        const result = await newWalletAddress.save();
        if (result !== undefined) {
            res.send({
                status: 'success'
            })
        } else {
            res.send({
                status: 'unknown error',
                comment: 'Unknown error found'
            })
        }
    }
}

exports.getWhitelists = async (req, res) => {
    const whitelists = await Whitelists.find({}, {__v: 0}).exec();
    if (whitelists.length > 0) {
        res.send({
            status: 'success',
            whitelists
        })
    } else {
        res.send({
            status: 'empty',
            comment: 'No whitelisted wallet address'
        })
    }
}

exports.deleteWalletAddress = async (req, res) => {
    const _id = req.body._id;
    const wallet_address = req.body.wallet_address;
    const result = await Whitelists.findByIdAndDelete({_id, wallet_address}).exec();
    if (result !== undefined) {
        res.send({status: 'success'})
    } else {
        res.send({
            status: 'error',
            comment: 'Unknown error found'
        })
    }
}

exports.updateWhitelist = async (req, res) => {
    const wallet_address = req.body.wallet_address;
    const owner = req.body.owner;
    const duration = req.body.duration; 
    const prev = await Whitelists.findOne({wallet_address}).exec();
    let expired_at;
    if (!moment().isAfter(moment(prev.expired_at, 'DD/MM/YYYY HH:m:s').toDate(), 'day')) {
        expired_at = moment(moment(prev.registered_at, 'DD/MM/YYYY HH:m:s').toDate()).add(duration, 'days').format('DD/MM/YYYY');
    } else {
        expired_at = moment().add(duration, 'days').format('DD/MM/YYYY');
    }
    const result = await Whitelists.findOneAndUpdate({wallet_address}, {owner, duration, expired_at});
    if (result !== undefined) {
        res.send({status: 'success'});
    } else {
        res.send({
            status: 'error',
            comment: 'Unknown error found'
        });
    }
}

exports.checkWhitelisted = async (req, res) => {
    const wallet_address = req.body.wallet_address;
    const item = await Whitelists.findOne({wallet_address}).exec();
    if (item !== undefined) {
        if (!moment().isAfter(moment(item.expired_at, 'DD/MM/YYYY').toDate(), 'day')) {
            res.send({status: 'success'})
        } else {
            res.send({
                status: 'not whitelisted',
                comment: 'This wallet address is not whitelisted'
            })
        }
    } else {
        res.send({
            status: 'not whitelisted',
            comment: 'This wallet address is not whitelisted'
        })
    }
}

exports.addTwitterAccout = async (req, res) => {
    const user_id = req.body.user_id;
    const username = req.body.username;
    const email = req.body.email;
    const name = req.body.name;
    const total_points = req.body.total_points;
    const authorized_access = req.body.authorized_access;
    const joined_at = req.body.joined_at;

    const account = (await XAccounts.find({username}).exec());
    if (account.length > 0) {
        res.send({
            status: 'existed',
            comment: 'already existed'
        })
    } else {
        const newAccount = XAccounts({user_id, username, name, email, total_points, authorized_access, joined_at});
        const result = await newAccount.save();
        if (result !== undefined) {
            res.send({
                status: 'success'
            })
        } else {
            res.send({
                status: 'Error Found'
            })
        }
    }
}

exports.getTwitterAccounts = async (req, res) => {
    const xaccounts = await XAccounts.find({}, {__v: 0}).exec();
    if (xaccounts.length > 0) {
        res.send({
            status: 'success',
            xaccounts
        })
    } else {
        res.send({
            status: 'empty',
            comment: 'no xaccount registered'
        })
    }
}

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counters.findOneAndUpdate(
        {_id: sequenceName},
        {$inc: {sequence_value: 1}},
        {new: true, upsert: true}
    );
    return sequenceDocument.sequence_value;
}