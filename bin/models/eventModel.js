const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');//require('./../../server').mongoose;



let eventSchema = mongoose.Schema({
    name: String,
    eventDate: Date, 
    creatingDate: Date,
    description: String,
    status: Number,
    invites: String,// id стэкхолдеров которые приглашены на мероприятие
    //вероятно будет лучше хранить приглашения в модели стэекхолдеров
    address: String,
    annotation: String,
    prezentation: String,
    img: String

});

eventSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await eventSchema.findById(req.body.eventid)));
    },
    create: function (req, res, next) {
        let event = new eventSchema(req.body);
        event.save();
        res.json(JSON.stringify(event))
    },
    update: async function (req, res, next) {
        let event = await event.findById(req.body.eventid);
        //TODO: перезапись полей по найденным параметрам
        //TODO: ограничение на выполнение, только админ может вызывать метод
        res.json('обновил');
    },
    delete: async function (req, res, next) {
        let event = await eventModel.findById(req.body.eventid);
        event.remove();
        res.json(`${req.body.eventid} - удалён`);
    }
    

}
let eventModel = mongoose.model('event', eventSchema);
module.exports.eventModel = eventModel;

//CRUD API 
router.get('/', eventModel.read);
router.post('/', eventModel.create);
router.put('/', eventModel.update);
router.delete('/', eventModel.delete);

module.exports.router = router;