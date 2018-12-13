const express = require('express');
const router = express.Router();
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const send = require('./../utils/email').Send;

class Negotiation{
    static async showall(req, res, next){
        try{
            let file = await fileNegotiationModel.find();
            let mas = [];
            for (let i=0;i<file.length;i++){
                if(file[i].access.indexOf(req.session.stakeholder.login)>=0){
                if(file[i].agreement.find(x => x.login === req.session.stakeholder.login)) file[i].agr = true;
                mas=[...mas,file[i]]; 
            }
            }
            mas.map(it => {let m=[]; m=it.account; it.account=m.filter(item=>
                {if(item.user == req.session.stakeholder.login || item.sender == req.session.stakeholder.login) return true; else return false}); return it})
            res.render('fileNegotiationShowAll.html',{
                mas:mas.reverse()
            })
            }
        catch(e){
            console.log(e);
                res.end('error')
            }
    }
    static async regforall(req, res, next){
        try{
            let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
            let obj={user: 'admin', date: Date.now().toString(), sender: req.session.stakeholder.login, text: req.body.dialog};
            fileN.account=[...fileN.account,obj];
            if(fileN.lastDate>=new Date()) await fileN.save();
            res.redirect('/lk')
            }
        catch(e){
            console.log(e)
                res.end('error')
            }
    }
    static async agreement(req, res, next){
        try{
            let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
            if (!fileN.agreement.find(x => x.login === req.session.stakeholder.login))
            {
            fileN.agreement=[...fileN.agreement,{login: req.session.stakeholder.login, data: Date.now().toString()}]
            await fileN.save();
            let sh = await stakeholderModel.findOne({login:req.session.stakeholder.login})
            let content = {name:req.params.name}
            send(sh, 5 , content);
            }
            res.redirect('/lk')
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