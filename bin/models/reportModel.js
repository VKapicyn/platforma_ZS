const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');//require('./../../server').mongoose;



let reportSchema = mongoose.Schema({
    name: String,
    description: String,
    index: Number,
    src: String
});

reportSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await reportSchema.findById(req.body.id)));
    },
    create: function (req, res, next) {
        let ref = new reportSchema(req.body);
        report.save();
        res.json(JSON.stringify(report))
    },
    update: async function (req, res, next) {
        let event = await reportModel.findById(req.body.eventid);
        //TODO: перезапись полей по найденным параметрам
        //TODO: ограничение на выполнение, только админ может вызывать метод
        res.json('обновил');
    },
    delete: async function (req, res, next) {
        let report = await refModel.findById(req.body.eventid);
        rereport.remove();
        res.json(`${req.body.reportid} - удалён`);
    }
    

}
let reportModel = mongoose.model('reports', reportSchema);
module.exports.reportModel = reportModel;

//CRUD API
router.get('/', reportModel.read);
router.post('/', reportModel.create);
router.put('/', reportModel.update);
router.delete('/', reportModel.delete);

module.exports.router = router;