const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5');
const shModel = require('../models/stakeholderModel').stakeholderModel;
const Json2csvParser = require ( 'json2csv' ) . Parser ;
const eventModel = require('../models/eventModel').eventModel;
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;
const mongoose = require('mongoose');
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

class Lk {
    static async eventMethod(req,res,next){
        let _id =req.session.stakeholder.id;
        
        let sh = await shModel.update({  _id : _id , 'events.eventId' : req.params.event},{$set:{"events.$.readyToGo":req.params.go}});
        res.redirect('/lk');

    }
    static async getPage(req, res, next) {
//<<<<<<< HEAD
        if (req.session.stakeholder)
        {   
            let readyToGo={};
            let sh = await shModel.findOne({login:req.session.stakeholder.login})
            let lvl;
            let log;
            let mas_n=[];
            let mas_d=[];
            let mas_nr=[];
            let mas_dr=[];
            let acc = [];
            let shAccount = await shModel.find({_id: req.session.stakeholder.id});
            let arr=[];
            let shEvents=[];

            shAccount[0].events.forEach(i => {
                   
                arr.push({_id : i.eventId});
                readyToGo[i.eventId] = i.readyToGo;

            });
            if (arr.length > 0){
             shEvents = await eventModel.find({"$or": arr});
            }
            console.log(arr);
            // shEvents.eventDate = new Date();
            let date={};
            shEvents.forEach(i => {
                 date[i._id] = i.eventDate.toLocaleString("ru", {day: 'numeric'})+ '.' + i.eventDate.toLocaleString("ru", {month: 'numeric'}) + '.' + i.eventDate.toLocaleString("ru", {year: 'numeric'});
            });
            
        
            console.log(date);
            if(req.session.user) {lvl='user'; log=req.session.user.login}
            if(req.session.stakeholder) {lvl='stakeholder'; log=req.session.stakeholder.login}
            let survey = await surveytemplateModel.find();
            for (let i=0;i<survey.length;i++){
                acc[i]=0;
                for (let j=0;j<survey[i].result.length;j++){
                if(survey[i].result[j].login == log){
                    acc[i]=1; 
                }
            }
            }
            for(let i=0;i<survey.length;i++){
                if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && (survey[i].accessLVL == lvl || survey[i].accessLVL == 'user') && acc[i] < 1 && survey[i].annotation){
                    
                    mas_n=[...mas_n,{name:survey[i].name,
                        fd:survey[i].firstDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {year: 'numeric'}),
                        ld:survey[i].lastDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {year: 'numeric'})}];
                    mas_d=[...mas_d,survey[i].description];
                }
                else if(survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && (survey[i].accessLVL == lvl || survey[i].accessLVL == 'user') && acc[i] < 1 && !survey[i].annotation){
                    mas_n=[...mas_n,{name:survey[i].name,
                        fd:survey[i].firstDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {year: 'numeric'}),
                        ld:survey[i].lastDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {year: 'numeric'})}];
                    mas_d=[...mas_d,survey[i].description];
                }
                else if(survey[i].accessLVL == lvl && acc[i] > 0 && survey[i].annotation){
                    mas_nr=[...mas_nr,{name:survey[i].name,
                        fd:survey[i].firstDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].firstDate.toLocaleString("ru", {year: 'numeric'}),
                        ld:survey[i].lastDate.toLocaleString("ru", {day: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {month: 'numeric'}) + '-' + survey[i].lastDate.toLocaleString("ru", {year: 'numeric'})}];
                    mas_dr=[...mas_dr,survey[i].description];
                }
            }
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.stakeholder.login)>=0){
                if(file[i].agreement.find(x => x.login === req.session.stakeholder.login)) file[i].agr = true;
                mas=[...mas,file[i]]
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.stakeholder.login || item.sender == req.session.stakeholder.login)
                {
                    let t = new Date(+item.date)
                    t = t.toLocaleString("ru", {day: 'numeric'}) + '-' + t.toLocaleString("ru", {month: 'numeric'}) + '-' + t.toLocaleString("ru", {year: 'numeric'});
                    item.date = t;
                    return true;
                }   
                else return false}); return it})
            res.render('lk.html', {
                mas_name:mas_n,
                mas_desc:mas_d,
                res_name:mas_nr,
                res_desc:mas_dr,
                readyToGo: readyToGo,
                events: shEvents,
                eventDate: date,
                mas: mas.reverse(),
                sh:sh
            });
        }
        else
            res.redirect('/loginuser')
    }
    static logout(req, res, next){
        delete req.session.stakeholder;
        res.redirect('/loginuser')
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
                res.attachment('shInfo.csv');
                res.status(200).send(csv); 
                res.redirect('/lk');
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
router.get('/', Lk.getPage);
router.post('/', Lk.changePassword);
router.post('/shMethod',adminModel.isAdminLogged,Lk.shMethod);
router.get('/logout', Lk.logout)
router.get('/:event/:go',Lk.eventMethod);

module.exports.router = router;