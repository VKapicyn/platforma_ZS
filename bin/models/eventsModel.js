const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');//require('./../../server').mongoose;



let eventsSchema = mongoose.Schema({
    id:Number,
    name: String,
    event_date: Date, 
    creating_date: Date,
    description: String,
    status: String,
    invites: Object,// id стэкхолдеров которые приглашены на мероприятие
    //вероятно будет лучше хранить приглашения в модели стэекхолдеров
    parties: Object,//участники мероприятия
    coords: [{ x: String, y: String }]
});

eventsSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await eventsSchema.findById(req.body.eventid)));
    },
    create: function (req, res, next) {
        let event = new eventsSchema(req.body);
        event.save();
        res.json(JSON.stringify(event))
    },
    update: async function (req, res, next) {
        let event = await userModel.findById(req.body.eventid);
        //TODO: перезапись полей по найденным параметрам
        //TODO: ограничение на выполнение, только админ может вызывать метод
        res.json('обновил');
    },
    delete: async function (req, res, next) {
        let event = await eventsModel.findById(req.body.eventid);
        event.remove();
        res.json(`${req.body.eventid} - удалён`);
    }
    

}
let eventsModel = mongoose.model('events', eventsSchema);
module.exports.eventsModel = eventsModel;

//CRUD API
router.get('/', eventsModel.read);
router.post('/', eventsModel.create);
router.put('/', eventsModel.update);
router.delete('/', eventsModel.delete);

module.exports.router = router;