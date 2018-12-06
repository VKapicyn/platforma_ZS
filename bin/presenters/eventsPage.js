const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel').eventModel;
const adminModel = require('../models/adminModel').adminModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const userModel = require('../models/userModel').userModel;
const send = require('./../utils/email').Send;
const Json2csvParser = require ( 'json2csv' ) . Parser ;


class Events {
    static getPage(req, res, next) {
        
        res.render('events.html', {
            admin: 'admin'
        });
    }
    static async getEditEventPage(req,res,next){
        let event;
        try{
            event =  await eventModel.findById(req.params.id);
        }
        catch(e) {event = e}
        res.render('editEvent.html', {
            event: event,
        });
    }
    static async getCsv(req,res,next){
        let sh = await stakeholderModel.find({'events.eventId': req.params.id});
        let fields = [{
            label:'Имя',
            value:'firstname'
        },
        {
            label:'Фамилия',
            value: 'lastname'
        },
        {
            label:'Отчество',
            value: 'patronymic'
        },
        {
            label:'Ответ на приглашение',
            value: 'events.readyToGo'
        },
        {
            label:'Организация',
            value: 'organization'
        },
        {
            label:'Интересы',
            value:'interest'
        },
        {
            label:'Контактная иформация',
            value:'contact_information'
        },
        {
            label:'Адрес',
            value:'address'
        },
        {
            label:'Соц. сети',
            value:'social_network'
        }];
        let json2csvParser = new Json2csvParser ( {  fields  } ) ;    
                const csv = json2csvParser.parse( sh ) ; 
                res.set('Content-Type', 'application/octet-stream');
                res.attachment('invitesSh-'+req.params.id+'.csv');
                res.status(200).send(csv); 
                res.redirect('/lk');
                res.end;
    }
    static async editEventPage(req,res,next){


        res.render('editEvent.html',{

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
        console.log(req.body.name);
        try {
            let now = new Date();
            console.log(req.body.name);
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
                            { $push: { events:  {eventId: event._id, readyToGo:'Не просмотрел приглашение'}} }) ; 
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
router.get('/edit/:id', Events.getEditEventPage);
router.post('/edit/:id', Events.editEventPage);
router.get('/csv/:id', Events.getCsv);
router.get('/new', adminModel.isAdminLogged, Events.getNewEventPage);
router.post('/new', adminModel.isAdminLogged, Events.createNewEvent);
module.exports.router = router;