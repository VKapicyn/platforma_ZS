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
    static async getPage(req, res, next) {
        let sh = (req.session.stakeholderModel) ? await shModel.findOne({login:req.session.stakeholderModel.login}) : undefined;
        let events =  await eventModel.find();
        events.forEach(i => {
            if (i.eventDate)
            i.date = i.eventDate.toLocaleString("ru-RU", {day: 'numeric', month: 'numeric', year:'numeric', hour: '2-digit', minute:'2-digit'});
        });
        res.render('events.html', {
            events: events,
            sh:sh
        });
    }
    static async getEditEventPage(req,res,next){
        let event;
        let sh = (req.session.stakeholderModel) ? await shModel.findOne({login:req.session.stakeholderModel.login}) : undefined;
        try{
            event =  await eventModel.findById(req.params.id);
        }
        catch(e) {event = e}
        res.render('editEvent.html', {
            event: event,
            sh:sh
        });
    }
    static async getCsv(req,res,next){
        let sh = await stakeholderModel.find({'events.eventId': req.params.id});
        // if (sh.events.readyToGo == 1)sh.events.readyToGo = 'Cогласился';
        // if (sh.events.readyToGo == 2)sh.events.readyToGo = 'Отказался';
        // if (sh.events.readyToGo == 0)sh.events.readyToGo = 'Не смотрел приглашение';
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

        let event;
            event =  await eventModel.findById(req.params.id);
            console.log(event);
            if (req.files){
            if(req.files.annotation && req.files.annotation[0].contentType == 'application/pdf'){
                delFile(event.annotation);
                event.annotation = req.files.annotation[0].filename;
            }
            
            if(req.files.img && req.files.img[0].contentType == 'image/png'){
                delFile(report.imgSrc);
                report.img = req.files.img[0].filename;
            }
        }
            if(req.body.description) event.description=req.body.description;
            if(req.body.name) event.name=req.body.name;
            if(req.body.address) event.address=req.body.address;
            if(req.body.date) event.eventDate=req.body.date;
            event.save();
            res.redirect('/events/id/'+event._id);

        
        // res.render('editEvent.html', {
        //     event: event,
        // });
       
    }
    static async getPageByEventId(req, res, next) {
        let event;
        let sh = (req.session.stakeholderModel) ? await shModel.findOne({login:req.session.stakeholderModel.login}) : undefined;
        try{
            event =  await eventModel.findById(req.params.id);
        }
        catch(e) {event = e}
        res.render('eventPage.html', {
            event: event,
            sh:sh
        });
    }
    static async getNewEventPage(req, res, next){
        res.render('newEvent.html', {
        });
    }
    static async createNewEvent(req, res, next){
            if( !req.body.name || !req.body.description || !req.body.address || !req.body.date ) {
                
            }
            else{
            const shChecked = req.body.shCheck;
            let img = 'nophoto';
            let annotation = 'nofile';
            let prezentation = 'nofile'
            if (req.files){ 
                req.files.img? img = req.files.img[0].filename:img= img
                req.files.annotation? annotation = req.files.annotation[0].filename:annotation= annotation;
                req.files.prezentation? prezentation = req.files.prezentation[0].filename:prezentation= prezentation;
            }
            let event = new eventModel({
                name: req.body.name,
                description: req.body.description,
                eventDate: req.body.date,
                creatingDate: new Date(),
                status: '1',
                address: req.body.address,
                invites: '',
                img: img,
                prezentation: prezentation,
                annotation: annotation
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
                        { $push: { events:  {eventId: event._id, readyToGo:0} }}) ;
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
        
            res.redirect('/events/id/'+event._id);
            }
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
router.post('/new', adminModel.isAdminLogged,upload.fields([{ name: 'img', maxCount: 1 }, { name: 'annotation', maxCount: 1 },{ name: 'prezentation', maxCount: 1 }]), Events.createNewEvent);
module.exports.router = router;