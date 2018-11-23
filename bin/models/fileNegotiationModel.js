const express = require('express');
//const router = express.Router();
const mongoose = require('mongoose');

let fileNegotiationSchema = mongoose.Schema({
    name: {type: String,unique: true},
    description: String,
    file: String,
    access: Array,
    account: Array,
    agreement: Array,
    comment: String
});

let fileNegotiationModel = mongoose.model('fileNegotiation', fileNegotiationSchema);
module.exports.fileNegotiationModel = fileNegotiationModel;

