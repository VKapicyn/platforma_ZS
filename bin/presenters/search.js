const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const reportModel = require('../models/reportModel').reportModel;
const eventModel = require('../models/eventModel').eventModel;
const fs = require('fs')

class Search{
    static async getResult(req, res, next){
        try{
            let lvl;
            let log;
            let sur=[];
            let acc = [];
            if(req.session.userModel) {lvl='user'; log=req.session.userModel.login}
            if(req.session.stakeholderModel) {lvl='stakeholder'; log=req.session.stakeholderModel.login}
            let survey = await surveytemplateModel.find({accessLVL:lvl});
            for (let i=0;i<survey.length;i++){
                acc[i]=0;
                for (let j=0;j<survey[i].result.length;j++){
                if(survey[i].result[j].login == log){
                    acc[i]=1; 
                }
            }
            }
            //console.log(req.body)
            for(let i=0;i<survey.length;i++){
                if ((survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && survey[i].accessLVL == lvl && acc[i] < 1 || survey[i].annotation) && (survey[i].name == req.body.search || survey[i].description == req.body.search)){
                    
                    sur=[...sur,{name:survey[i].name,description:survey[i].description}]

                }
                
            }
            //console.log(sur);
            //console.log(sur_d)
            //////////////////////////////////////
            let report =  await reportModel.find();
            let rep = []
            for (let i=0; i < report.length; i++){
                if(report[i].name == req.body.search || report[i].description ==req.body.search){
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
                if(event[i].name == req.body.search || event[i].description ==req.body.search){
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
            if (ins.indexOf(req.body.search)) ins = 'инструкция';
            else ins =''
            
            res.render('search.html',{
                survey:sur,
                report:rep,
                event:ev,
                instruction:ins

            })
            
        }
        catch(e){

        }
    }
}

router.post('/',Search.getResult);

module.exports.router = router;