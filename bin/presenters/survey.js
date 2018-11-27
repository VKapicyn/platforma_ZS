const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;


class Survey{
    static async getPage(req, res, next) {
        let surveytemplate;
        try{
            let survey =  await surveytemplateModel.findOne({name:req.params.name});
            let log;
            let lvl;
            let acc = 0;
            let date = 1;
            let andate;
            if(req.session.userModel) {lvl='user'; log=req.session.userModel.login}
            if(req.session.stakeholderModel) {lvl='stakeholder'; log=req.session.stakeholderModel.login}
                for (let j=0;j<survey.result.length;j++){
                if(survey.result[j].login == log){
                    acc++;
                    date=survey.result[j].date;
                }
            
            }
            date=Number(new Date(Number(date)))
            if(survey.annotation) andate=survey.annotation.date
            andate=Number(new Date(Number(andate)))
            if((survey.firstDate<=new Date() && survey.lastDate>=new Date() && survey.accessLVL == lvl && acc < 1) || (andate > date)) {surveytemplate=survey}
            else {{res.end('error');return;}}
        }
        catch(e) {surveytemplate = e;}
        if(!surveytemplate.annotation){
            res.render('Survey.html', {
                description: surveytemplate.description,
                name: surveytemplate.name,
                question: surveytemplate.data.question,
                answer: surveytemplate.data.answer
            });
        }
        else{

            
        res.render('Survey.html', {
            description: surveytemplate.description,
            name: surveytemplate.name,
            question: surveytemplate.data.question,
            answer: surveytemplate.data.answer,
            annotation: surveytemplate.annotation.text,
            file: `/file/${surveytemplate.annotation.file}`
        });
        
    }
    }
    static async reg(req,res,next){
        let err='успешно';
        if( !req.params.name || !req.body.answer ) {
            res.end('Все поля должны быть заполнены');
        }
        else{
        try {
            let survey = await surveytemplateModel.findOne({name:req.params.name})
            let log;
            let lvl;
            let acc = 0;
            let date = 1;
            let andate;
            if(req.session.userModel) {lvl='user'; log=req.session.userModel.login}
            if(req.session.stakeholderModel) {lvl='stakeholder'; log=req.session.stakeholderModel.login}
                for (let j=0;j<survey.result.length;j++){
                if(survey.result[j].login == log){
                    acc++;
                    date=survey.result[j].date;
                }
            
            }
            date=Number(new Date(Number(date)))
            if(survey.annotation) andate=survey.annotation.date
            andate=Number(new Date(Number(andate)))
            if(!((survey.firstDate<=new Date() && survey.lastDate>=new Date() && survey.accessLVL == lvl && acc < 1) || (andate > date))){res.end('error');return;}
            else{
                let obj={}
                obj.answer=req.body.answer;
                obj.date=Date.now().toString();
                if(req.session.stakeholderModel){obj.login=req.session.stakeholderModel.login}
                if(req.session.userModel){obj.login=req.session.userModel.login}
                survey.result=[...survey.result,obj]
            survey.save()
        }
        } catch (e) {
            console.log(e)
        }
    }
        res.end(err);
    }
    static async show(req,res,next){
        let lvl;
        let log;
        let mas_n=[];
        let mas_d=[];
        let acc = [];
        let date = [];
        let andate =[];
        if(req.session.userModel) {lvl='user'; log=req.session.userModel.login}
        if(req.session.stakeholderModel) {lvl='stakeholder'; log=req.session.stakeholderModel.login}
        let survey = await surveytemplateModel.find({accessLVL:lvl});
        for (let i=0;i<survey.length;i++){
            acc[i]=0;
            for (let j=0;j<survey[i].result.length;j++){
            if(survey[i].result[j].login == log){
                acc[i]=1; 
                date[i]=Number(new Date(Number(survey[i].result[j].date)))
            }
            if(survey[i].annotation) andate[i]=Number(new Date(Number(survey[i].annotation.date)))
        }
        }
        for(let i=0;i<survey.length;i++){
            if ((survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && survey[i].accessLVL == lvl && acc[i] < 1) || (andate[i] > date[i])){
                
                mas_n=[...mas_n,survey[i].name];
                mas_d=[...mas_d,survey[i].description];
            }
        }
        res.render('AllSurvey.html', {
            mas_name:mas_n,
            mas_desc:mas_d
        });
    }

}

router.get('/', Survey.show);
router.get('/name:name', Survey.getPage);
router.post('/name:name/reg', Survey.reg);


module.exports.router = router;