const express = require('express');
//const router = express.Router();
const mongoose = require('mongoose');

let fileNegotiationSchema = mongoose.Schema({
    name: {type: String,unique: true},
    description: String,
    type: Number,
    file: String,
    access: Array,
    account: Array,
    agreement: Array,
    firstDate: Date, 
    lastDate: Date,
    group: Array
});

let fileNegotiationModel = mongoose.model('fileNegotiation', fileNegotiationSchema);
module.exports.fileNegotiationModel = fileNegotiationModel;

