const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let stakeholderSchema = mongoose.Schema({
    login: {type: String, unique: true},
    password: String,
    state: Number
});

stakeholderSchema.statics = {
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
let stakeholderModel = mongoose.model('stakeholder', stakeholderSchema);
module.exports.stakeholderModel = stakeholderModel;


