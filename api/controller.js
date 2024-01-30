const Users = require("../model/User");
const Counters = require('../model/Counter');
const md5 = require("md5");

exports.signup = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = md5(req.body.password);
    const registered_at = (new Date()).toLocaleString('en-US', {hour12: false});
    const newUser = Users({ _id: await getNextSequenceValue('users'), name, email, password, registered_at});
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
    const password = req.body.password;
    let result;

    if (password === '') {
        result = await Users.findOneAndUpdate({_id: id}, {
            name,
            email,
        });
    } else {
        result = await Users.findOneAndUpdate({_id: id}, {
            name,
            email,
            password: md5(password)
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

const getNextSequenceValue = async (sequenceName) => {
    const sequenceDocument = await Counters.findOneAndUpdate(
        {_id: sequenceName},
        {$inc: {sequence_value: 1}},
        {new: true, upsert: true}
    );
    return sequenceDocument.sequence_value;
}