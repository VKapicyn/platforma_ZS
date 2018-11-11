const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

class CreateSurvey{
    static async getPage(req, res, next) {
        let surveytemplate;
        try{
            let survey =  await surveytemplateModel.findOne({'name':req.params.name});
            console.log(req.session)
            console.log(survey.accessLVL)
            console.log(req.session[survey.accessLVL+'Model'])
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
        let lvl
        let mas=[]
        console.log(req.session)
        if(req.session.userModel != undefined ) lvl='user'
        if(req.session.stakeholderModel != undefined ) lvl='stakeholder'
        if(req.session.admin != undefined ) lvl='admin'
        console.log(lvl)
        let survey = await surveytemplateModel.find({accessLVL:lvl});
        console.log(survey)
        console.log(survey.length)
        for(let i=0;i<survey.length;i++){
            if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date()){
                mas=[...mas,survey[i].name]
            }
        }
        console.log(mas)
        res.render('AllSurvey.html', {
            mas_name:mas
        });
    }

}

router.get('/', CreateSurvey.show);
router.get('/name:name', CreateSurvey.getPage);
router.post('/name:name/reg', CreateSurvey.reg);


module.exports.router = router;