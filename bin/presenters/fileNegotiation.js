const express = require('express');
const router = express.Router();
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;


class Negotiation{
    static async showall(req, res, next){
        try{
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.user.login)>=0){
                mas=[...mas,file[i]]
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.user.login || item.sender == req.session.user.login) return true; else return false}); return it})
            res.render('fileNegotiationShowAll.html',{
                mas:mas
            })
            }
        catch(e){
                res.end('error')
            }
    }
    static async regforall(req, res, next){
        try{
            let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
            let obj={user: 'admin', date: Date.now().toString(), sender: req.session.user.login, text: req.body.dialog};
            fileN.account=[...fileN.account,obj];
            if(fileN.firstDate<=new Date() && fileN.lastDate>=new Date()) await fileN.save();
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.user.login)>=0){
                mas=[...mas,file[i]]
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.user.login || item.sender == req.session.user.login) return true; else return false}); return it})
            res.redirect('/fileNegotiation/all')
            }
        catch(e){
                res.end('error')
            }
    }
    static async agreement(req, res, next){
        try{
            let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
            if (fileN.agreement.indexOf(req.session.user.login)<0)
            fileN.agreement=[...fileN.agreement,{login: req.session.user.login, data: Date.now().toString()}]
            await fileN.save();
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.user.login)>=0){
                mas=[...mas,file[i]]
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.user.login || item.sender == req.session.user.login) return true; else return false}); return it})
            res.redirect('/fileNegotiation/all')
            }
        catch(e){
                res.end('error')
            }
    }
}

router.get('/all',Negotiation.showall);
router.post('/all/msg:name',Negotiation.regforall);
router.post('/all/agr:name',Negotiation.agreement);


module.exports.router = router;