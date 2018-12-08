const express = require('express');
const router = express.Router();
const eventModel = require('../models/eventModel').eventModel;
const adminModel = require('../models/adminModel').adminModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const userModel = require('../models/userModel').userModel;
const send = require('./../utils/email').Send;
const Json2csvParser = require ( 'json2csv' ) . Parser ;
const multer  = require('multer');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage();
const upload = multer({ storage });



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
        try {
            const shChecked = req.body.shCheck;
           
           
            let event = new eventModel({
                name: req.body.name,
                description: req.body.description,
                eventDate: req.body.date,
                creatingDate: new Date(),
                status: '1',
                address: req.body.address,
                invites: '',
                img: req.files.img[0].filename,
                annotation: req.files.annotation[0].filename
            })
            if(event){

                let sh=[];
                let arr=[];
                if(Array.isArray(shChecked)){
                    event.invites = JSON.stringify(shChecked);
                    
                    
                    shChecked.forEach(i => {
                       
                        arr.push({_id : i})
    
                    });
                    
                     sh = await stakeholderModel.find({"$or": arr});
                     console.log(arr);
                }
                else{
                    console.log(shChecked);
                    
                    // event.invites = shChecked;
                     sh = await stakeholderModel.find({_id:shChecked});
                     console.log(sh);
                }
                sh.map(async function(sh){
                    await stakeholderModel.findOneAndUpdate({_id: sh._id},  
                        { $push: { events:  {eventId: event._id, readyToGo:0}} }) ;
                    send(sh,2,event);
                });
                // if(req.body.shCheckAll){
                //     let results = await stakeholderModel.find();
                //     const items = [];
                //     results.forEach(i => {
                //         items.push(i._id);

                //     });
                    
                //     results.map(async function(sh){
                //         await stakeholderModel.findOneAndUpdate({_id: sh._id},  
                //             { $push: { events:  {eventId: event._id, readyToGo:'Не просмотрел приглашение'}} }) ; 
                //         send(sh,2,event);
                //     });
                // }
            event.save();
        
            res.redirect('/events/edit/'+event._id);
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
router.post('/new', adminModel.isAdminLogged,upload.fields([{ name: 'img', maxCount: 1 }, { name: 'annotation', maxCount: 1 }]), Events.createNewEvent);
module.exports.router = router;