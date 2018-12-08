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
    static async eventMethod(erq,res,next){
        shModel.findOneAndUpdate({'events.eventId': req.params.event},{$set: {'events.readyToGo': req.params.go }},(err) => {
            console.log(err);
        });
    }
    static async getPage(req, res, next) {
//<<<<<<< HEAD
        if (req.session.stakeholder)
        {
            let lvl;
            let log;
            let mas_n=[];
            let mas_d=[];
            let mas_nr=[];
            let mas_dr=[];
            let acc = [];
            if(req.session.user) {lvl='user'; log=req.session.user.login}
            if(req.session.stakeholder) {lvl='stakeholder'; log=req.session.stakeholder.login}
            let survey = await surveytemplateModel.find({accessLVL:lvl});
            for (let i=0;i<survey.length;i++){
                acc[i]=0;
                for (let j=0;j<survey[i].result.length;j++){
                if(survey[i].result[j].login == log){
                    acc[i]=1; 
                }
            }
            }
            for(let i=0;i<survey.length;i++){
                if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && survey[i].accessLVL == lvl && acc[i] < 1 && survey[i].annotation){
                    
                    mas_n=[...mas_n,survey[i].name];
                    mas_d=[...mas_d,survey[i].description];
                }
                else if(survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && survey[i].accessLVL == lvl && acc[i] < 1 && !survey[i].annotation){
                    mas_n=[...mas_n,survey[i].name];
                    mas_d=[...mas_d,survey[i].description];
                }
                else if(survey[i].accessLVL == lvl && acc[i] > 0 && survey[i].annotation){
                    mas_nr=[...mas_nr,survey[i].name];
                    mas_dr=[...mas_dr,survey[i].description];
                }
            }
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.stakeholder.login)>=0){
                mas=[...mas,file[i]]
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.stakeholder.login || item.sender == req.session.stakeholder.login) return true; else return false}); return it})
            res.render('lk.html', {
                mas_name:mas_n,
                mas_desc:mas_d,
                res_name:mas_nr,
                res_desc:mas_dr,
                mas: mas
            });
        }
        else
            res.redirect('/loginuser')
    }

    static async getCsv(req,res,next){
        let sh = await shModel.find({state: '1'},(err) =>{
            console.log(err);
/*=======
        let events= await eventModel.find();
        let sHolder= await shModel.find();
        let file = await fileNegotiationModel.find();
        let name = [];
        for (let i=0;i<file.length;i++){
            name=[...name,file[i].name]
        }
        res.render('lk.html', {
                negotiation:name,
                 events: events,
                 sHolder: sHolder,
                 counts: [sHolder.filter(function(x){return x.state==1}).length,sHolder.filter(function(x){return x.state==2}).length,sHolder.filter(function(x){return x.state==3}).length]
                // reports: await reportModel.find()
>>>>>>> origin/admin_lk*/
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
router.get('/:event/:go',Lk.eventMethod);

module.exports.router = router;