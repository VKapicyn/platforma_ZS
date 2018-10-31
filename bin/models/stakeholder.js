const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let regSchema = mongoose.Schema({
    login: String,
    password: String,
    state: Number
});
/*
regSchema.statics = {
    reg: async function(req, res, next){
        console.log(req)
        if(!req.body.login || !req.body.password){console.log(req.body);res.json({'error':'Все поля должны быть заполнены'});return;}
        let accountlogin = await accountModel.findOne({"login":req.body.login});
        if (accountlogin != undefined) res.json({'error':'логин занят'})
        else {
            let account = new accountModel(req.body);
            account.save();
            res.json('аккаунт создан')
        }
    }
}
*/
regSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await stakeholder.find({})));
    },
    create: function (req, res, next) {
        let user = new stakeholder(req.body);
        user.save();
        res.json(JSON.stringify(user))
    }
}
let stakeholder = mongoose.model('stakeholder', regSchema);
module.exports.stakeholder = stakeholder;


