const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5');
const shModel = require('../models/stakeholderModel').stakeholderModel;
const Json2csvParser = require ( 'json2csv' ) . Parser ;
const eventModel = require('../models/eventModel').eventModel;
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;
const reportModel = require('../models/reportModel').reportModel;
const mongoose = require('mongoose');
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;


class Lk {
    static async getPage(req, res, next) {
        let events= await eventModel.find();
        let survey =  await surveytemplateModel.find();
        let sHolder= await shModel.find();
        let file = await fileNegotiationModel.find();
        let reports = await reportModel.find();
        for (let i = 0; i < reports.length; i++){
            if(reports[i].creatingDate){
            let str_date = reports[i].creatingDate.toLocaleString("ru", {day: 'numeric'})+ '.' + reports[i].creatingDate.toLocaleString("ru", {month: 'numeric'}) + '.' + reports[i].creatingDate.toLocaleString("ru", {year: 'numeric'});
            reports[i].date = str_date
            }
        }
        for (let i = 0; i < events.length; i++){
            if(events[i].eventDate){
            let str_date = events[i].eventDate.toLocaleString("ru", {day: 'numeric'})+ '.' + events[i].eventDate.toLocaleString("ru", {month: 'numeric'}) + '.' + events[i].eventDate.toLocaleString("ru", {year: 'numeric'})
            + ' ' + events[i].eventDate.toLocaleString("ru", {hour: 'numeric'}) + ':' + events[i].eventDate.toLocaleString("ru", {minute: 'numeric'});
            events[i].date = str_date
            }
            console.log(events[i].date)
        }
        res.render('lkadmin.html', {
                file,
                 events: events,
                 sHolder: sHolder,
                 reports: reports,
                 survey: survey,
                 counts: [sHolder.filter(function(x){return x.state==1}).length,sHolder.filter(function(x){return x.state==2}).length,sHolder.filter(function(x){return x.state==3}).length]
                // reports: await reportModel.find()
        });
    }
    static async shMethod(req,res,next){
        
        let shChecked = req.body.shCheck;

            let arr=[];
            let sh=[];
            if(Array.isArray(shChecked)){
                shChecked.forEach(i => {
                   
                    arr.push({_id : i})

                });
                 sh = await shModel.find({"$or": arr});
            }
            else{
                 sh = await shModel.find({_id:shChecked});
                console.log(sh)
            }
        switch (req.body.shEvent){
            case 0: 
                res.send('Не выбрано действие');
                res.redirect('/lk');
            break;
            case 'csv':
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
                    label:'Организация',
                    value: 'organization'
                },
                {
                    label:'Группа заинтересованных сторон',
                    value: 'group'
                },
                {
                    label:'Интересы',
                    value:'time'
                },
                {
                    label:'История взаимотношений',
                    value:'history'
                },
                {
                    label:'Формат взаимотношений',
                    value:'format'
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
                if (json2csvParser) {  
                const csv = json2csvParser.parse( sh ) ; 
                // res.set('Content-Type', 'application/octet-stream');
                res.attachment('shInfo.csv');
                res.status(200).send(csv); 
                }
            break;
            case 'agree':
                sh.map(async function(sh){
                    await stakeholderModel.findOneAndUpdate({_id: sh._id},  
                        { $push: { state:  2 }}) ; 
                });
                res.redirect('/lk');

            break;
            case 'close':
            sh.map(async function(sh){
                await stakeholderModel.findOneAndUpdate({_id: sh._id},  
                    { $push: { state:  3 }}) ; 
            });
            res.redirect('/lk');
            break;
        }
    }
    static async changePassword(req,res,next){
    try{
        let model = req.session.admin?adminModel:shModel;
        const user = await adminModel.find({login: req.session.admin.login})
        console.log(user);
        model.findOneAndUpdate({login: req.session.admin.login},{$set: {password: toHash(req.body.password)}},(err) => {
            console.log(err);
        });
        res.redirect('/lk');
        
    }
    catch(e) {
        console.log(e);

    }
    
    }
}

//Роутинг внутри страницы
router.get('/',  Lk.getPage);
router.post('/',  Lk.changePassword);
router.post('/shMethod',Lk.shMethod);

module.exports.router = router;