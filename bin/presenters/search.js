const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const reportModel = require('../models/reportModel').reportModel;
const eventModel = require('../models/eventModel').eventModel;
const fs = require('fs')
const shModel = require('../models/stakeholderModel').stakeholderModel;

class Search{
    static async getResult(req, res, next){
        try{
            let lvl;
            let log;
            let sur=[];
            let acc = [];
            let survey;
            let sh1;
            if(req.session.user) {lvl='user'; log=req.session.userModel.login; survey = await surveytemplateModel.find({accessLVL:lvl});}
            if(req.session.stakeholder){
                lvl='stakeholder';
                log=req.session.stakeholder.login; 
                survey = await surveytemplateModel.find(); 
                sh1 = await shModel.findOne({login:req.session.stakeholder.login})
            }
            survey = await surveytemplateModel.find();
            for (let i=0;i<survey.length;i++){
                acc[i]=0;
                for (let j=0;j<survey[i].result.length;j++){
                if(survey[i].result[j].login == log){
                    acc[i]=1; 
                }
            }
            }
            if (req.body.search == '') req.body.search = new Date() //защита от пустой строки ;)
            //console.log(req.body)
            for(let i=0;i<survey.length;i++){
                //console.log((survey[i].group.indexOf('all') >= 0 || survey[i].group.indexOf(sh1.group[0]) >= 0))
                console.log(sh1)
                if ((survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && ( survey[i].accessLVL == 'user' || ((survey[i].accessLVL == lvl) && (survey[i].group.indexOf('all') >= 0 || survey[i].group.indexOf(sh1.group[0]) >= 0))) && acc[i] < 1 || survey[i].annotation) && (survey[i].name.search(req.body.search) >= 0 || survey[i].description.search(req.body.search) >= 0 )){
                    
                    sur=[...sur,{name:survey[i].name,description:survey[i].description,id:survey[i].id}]

                }
                
            }
            //console.log(sur);
            //console.log(sur_d)
            //////////////////////////////////////
            let report =  await reportModel.find();
            let rep = []
            for (let i=0; i < report.length; i++){
                if(report[i].name.search(req.body.search) >= 0 || report[i].description.search(req.body.search) >= 0){
                    rep=[...rep,{name:report[i].name,description:report[i].description,id:report[i].id}];
                }
            }
            //console.log(rep_n);
            //console.log(rep_d);
            //console.log(rep_f);
            /////////////////////////////////
            let event =  await eventModel.find();
            let ev = [];
            for (let i=0; i < event.length; i++){
                if(event[i].name.search(req.body.search) >= 0 || event[i].description.search(req.body.search) >= 0 ){
                    ev=[...ev,{name:event[i].name,description:event[i].description,id:event[i].id}];
                }
            }
            //console.log(ev_n);
            //console.log(ev_d);
            //console.log(ev_id);
            //////////////////////////////////////////////
            let ins;
            try{
            ins = fs.readFileSync('./src/views/instruction.html','utf8')
            }
            catch(e){
                console,log(e)
            }
            if (ins.search(req.body.search) >= 0) ins = 'инструкция';
            else ins =''
            
            res.render('search.html',{
                survey:sur,
                report:rep,
                event:ev,
                instruction:ins

            })
            
        }
        catch(e){
            console.log(e)
        }
    }
}

router.post('/',Search.getResult);

module.exports.router = router;