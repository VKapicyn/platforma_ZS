const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

let surveytemplateSchema = mongoose.Schema({
    name: {type: String, unique: true},
    firstDate: Date, 
    lastDate: Date,
    data: Object,
    annotation: String,
    accessLVL: String,
    login: String
});

surveytemplateSchema.statics = {
    read: async function (req, res, next) {
        res.json(JSON.stringify(await surveytemplatesModel.find({})));
    }

}

let surveytemplateModel = mongoose.model('surveytemplates', surveytemplateSchema);
module.exports.surveytemplateModel = surveytemplateModel;

//CRUD API
router.get('/', surveytemplateModel.read);

module.exports.router = router;
