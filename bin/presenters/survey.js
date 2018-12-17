const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;

class Survey{
    static async getPage(req, res, next) {
        let surveytemplate;
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        try{
            let survey =  await surveytemplateModel.findById(req.params.id);
            let log;
            let lvl;
            let acc = 0;
            let sh1;
            if(req.session.user) {lvl='user'; log=req.session.user.login}
            if(req.session.stakeholder) {lvl='stakeholder'; log=req.session.stakeholder.login; sh1 = await shModel.findOne({login:req.session.stakeholder.login})}
                for (let j=0;j<survey.result.length;j++){
                if(survey.result[j].login == log){
                    acc++;
                }
            
            }
            if(survey.firstDate<=new Date() && survey.lastDate>=new Date() && ( survey.accessLVL == 'user' || ((survey.accessLVL == lvl) && (survey.group.indexOf('all') >= 0 || survey.group.indexOf(sh1.group[0]) >= 0))) && acc < 1 && survey.annotation)
            {
                surveytemplate=survey;
                
                res.render('Survey.html', {
                    description: surveytemplate.description,
                    name: surveytemplate.name,
                    question: surveytemplate.data.question,
                    answer: surveytemplate.data.answer,
                    annotation: surveytemplate.annotation.text,
                    file: `/file/${surveytemplate.annotation.file}`,
                    sh:sh
                });
                
            
            }
            else if(survey.firstDate<=new Date() && survey.lastDate>=new Date() && ( survey.accessLVL == 'user' || ((survey.accessLVL == lvl) && (survey.group.indexOf('all') >= 0 || survey.group.indexOf(sh1.group[0]) >= 0))) && acc < 1 && !survey.annotation){
                surveytemplate=survey;
                res.render('Survey.html', {
                    description: surveytemplate.description,
                    name: surveytemplate.name,
                    question: surveytemplate.data.question,
                    answer: surveytemplate.data.answer,
                    sh:sh
                });
            }
            else if((((survey.accessLVL == lvl) && (survey.group.indexOf('all') >= 0 || survey.group.indexOf(sh1.group[0]) >= 0))) && acc > 0 && survey.annotation){
                surveytemplate=survey;
                res.render('Survey.html', {
                    description: surveytemplate.description,
                    name: surveytemplate.name,
                    annotation: surveytemplate.annotation.text,
                    file: `/file/${surveytemplate.annotation.file}`,
                    sh:sh
                });
            }
            else{res.redirect('/loginstakeholder');return;}
        }
        catch(e) {console.log(e)}
       
    }
    static async reg(req,res,next){
        let err='успешно';
        if( !req.params.id || !req.body.answer ) {
            res.end('Все поля должны быть заполнены');
        }
        else{
        try {
            let survey = await surveytemplateModel.findById(req.params.id)
            let log;
            let lvl;
            let acc = 0;
            if(req.session.user) {lvl='user'; log=req.session.user.login}
            if(req.session.stakeholder) {lvl='stakeholder'; log=req.session.stakeholder.login}
                for (let j=0;j<survey.result.length;j++){
                if(survey.result[j].login == log){
                    acc++;
                }
            
            }
            if(!(survey.firstDate<=new Date() && survey.lastDate>=new Date() && (survey.accessLVL == lvl || lvl == 'stakeholder') && acc < 1)){res.end('error');return;}
            else{
                let obj={}
                obj.answer=req.body.answer;
                obj.date=Date.now().toString();
                if(req.session.stakeholder){obj.login=req.session.stakeholder.login}
                if(req.session.user){obj.login=req.session.user.login}
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
        let mas_nr=[];
        let mas_dr=[];
        let acc = [];
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
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
                
                mas_n=[...mas_n,{name:survey[i].name,id:survey[i].id}];
                mas_d=[...mas_d,survey[i].description];
            }
            else if(survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && (survey[i].accessLVL == lvl || survey[i].accessLVL == 'user') && acc[i] < 1 && !survey[i].annotation){
                mas_n=[...mas_n,{name:survey[i].name,id:survey[i].id}];
                mas_d=[...mas_d,survey[i].description];
            }
            else if(survey[i].accessLVL == lvl && acc[i] > 0 && survey[i].annotation){
                mas_nr=[...mas_nr,{name:survey[i].name,id:survey[i].id}];
                mas_dr=[...mas_dr,survey[i].description];
            }
        }
        res.render('AllSurvey.html', {
            mas_name:mas_n,
            mas_desc:mas_d,
            res_name:mas_nr,
            res_desc:mas_dr,
            sh:sh
        });
    }
    static async showdemo(req,res,next){
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        if (!req.session.stakeholder && !req.session.user){
        let mas_n=[];
        let mas_d=[];
        let lvl='user';
        let survey = await surveytemplateModel.find({accessLVL:lvl});
        for(let i=0;i<survey.length;i++){
            if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date() && !survey[i].annotation){
                mas_n=[...mas_n,{name:survey[i].name,id:survey[i].id}];
                mas_d=[...mas_d,survey[i].description];
            }
            
        }
        res.render('AllSurvey.html', {
            mas_name:mas_n,
            mas_desc:mas_d,
            sh:sh
        });
    }
    else{
        res.redirect('/survey/full')
    }
    }

}

router.get('/', Survey.showdemo);
router.get('/full', Survey.show)
router.get('/id:id', Survey.getPage);
router.post('/id:id/reg', Survey.reg);


module.exports.router = router;