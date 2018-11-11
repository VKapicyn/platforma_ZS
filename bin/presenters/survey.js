const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

class CreateSurvey{
    static async getPage(req, res, next) {
        let surveytemplate;
        try{
            let survey =  await surveytemplateModel.findOne({'name':req.params.name});
            if(survey.firstDate<=new Date() && survey.lastDate>=new Date() && (req.session[survey.accessLVL+'Model'] != undefined || req.session[survey.accessLVL] != undefined)) {surveytemplate=survey}
            else {{res.end('залогинься!(либо опрос окончен)');return;}}
        }
        catch(e) {surveytemplate = e}
        res.render('Survey.html', {
            description:surveytemplate.description,
            name:surveytemplate.name,
            question: surveytemplate.data.question,
            answer: surveytemplate.data.answer
        });
    }
    static async reg(req,res,next){
        let err='успешно';
        if( !req.params.name || !req.body.answer ) {
            res.end('Все поля должны быть заполнены');
        }
        else{
        try {
            let survey = await surveytemplateModel.findOne({'name':req.params.name})
            if(!(survey.firstDate<=new Date() && survey.lastDate>=new Date()) || !((req.session[survey.accessLVL+'Model'] != undefined) || (req.session[survey.accessLVL] != undefined))) {res.end('залогинься!');return;}
            else{
                let obj={}
                obj.answer=req.body.answer;
                obj.login=req.session.userModel.login
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
        let mas_n=[];
        let mas_d=[];
        if(req.session.userModel) lvl='user'
        if(req.session.stakeholderModel) lvl='stakeholder'
        if(req.session.admin) lvl='admin'
        let survey = await surveytemplateModel.find({accessLVL:lvl});
        for(let i=0;i<survey.length;i++){
            if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date()){
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

router.get('/', CreateSurvey.show);
router.get('/name:name', CreateSurvey.getPage);
router.post('/name:name/reg', CreateSurvey.reg);


module.exports.router = router;