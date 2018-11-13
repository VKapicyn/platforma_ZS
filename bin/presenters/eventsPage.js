const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel').eventModel;
const adminModel = require('../models/adminModel').adminModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;


class Events {
    static getPage(req, res, next) {
        if (req.session.admin) var param ="admin"
        res.render('mainPage.html', {
            admin: param
        });
    }
    static async getPageByEventId(req, res, next) {
        let event;
        try{
            event =  await eventModel.findById(req.params.id);
        }
        catch(e) {event = e}
        res.render('events.html', {
            parametr: event,
        });
    }
    static async getNewEventPage(req, res, next){
        res.render('newEvent.html', {
        });
    }
    static async createNewEvent(req, res, next){
        try {
            if(req.body.send){
                var results = await stakeholderModel.find();
            }
            var items = [];
            results.forEach(i => {
                items.push(i._id);
            });
            
            let now = new Date();
            let event = new eventModel({
                'name': req.body.name,
                'description': req.body.description,
                'eventDate': req.body.date,
                'creatingDate': now,
                'status': '1',
                'address': req.body.address,
                'invites':JSON.stringify(items)
            })
            if (event){
                items.map(async function(id){
                await stakeholderModel.findOneAndUpdate({_id: id},  
                    { $push: { events:  {'eventId': event._id, 'readyToGo': false}} }) ; 
            })
            event.save();
            res.json(JSON.stringify(event));
            }
        } catch (e) {
        }
    }
}

//Роутинг внутри страницы
router.get('/',  Events.getPage);
router.get('/id/:id', Events.getPageByEventId);
router.get('/new', adminModel.isAdminLogged, Events.getNewEventPage);
router.post('/new', adminModel.isAdminLogged, Events.createNewEvent);
module.exports.router = router;