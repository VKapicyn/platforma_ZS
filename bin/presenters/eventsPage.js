const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel').eventModel;
const adminModel = require('../models/adminModel').adminModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const userModel = require('../models/userModel').userModel;
const send = require('./../utils/email').Send;


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
            let now = new Date();
            let event = new eventModel({
                name: req.body.name,
                description: req.body.description,
                eventDate: req.body.date,
                creatingDate: now,
                status: '1',
                address: req.body.address,
                invites: ''
            })
            if (event){
                if(req.body.send){
                    let results = await stakeholderModel.find();
                    const items = [];
                    results.forEach(i => {
                        items.push(i._id);

                    });
                    event.invites = JSON.stringify(items);
                    results.map(async function(sh){
                        await stakeholderModel.findOneAndUpdate({_id: sh._id},  
                            { $push: { events:  {eventId: event._id}} }) ; 
                        send(sh,2,event);
                    });
                }
            event.save();
        
            res.redirect('/events');
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