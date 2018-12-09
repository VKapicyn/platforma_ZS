const express = require('express');
const mongoose = require('mongoose');

let stakeholderSchema = mongoose.Schema({
    login: {type: String,unique: true},
    password: String,
    state: Number,
    firstname: String,
    lastname: String,
    patronymic: String,
    position: String,
    organization: String,
    group: Array,
    interest: Array,
    time: String,
    history: Array,
    contact_information: String,
    address: String,
    consent: Boolean,
    key: String,
    email: String,
    regDate: Date,
    events: [{
        _id: false,
        eventId : String,
        readyToGo  : String,
        default: {}
     }]
});

stakeholderSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await stakeholderModel.find({})));
    },
    create: function (req, res, next) {
        let user = new stakeholderModel(req.body);
        user.save();
        res.json(JSON.stringify(user))
    },
    isStakeholderLogged: function (req, res, next) {
        if(req.session.stakeholder){
            return next()
        }
    }
}
let stakeholderModel = mongoose.model('stakeholder', stakeholderSchema);
module.exports.stakeholderModel = stakeholderModel;