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
            if(survey.firstDate<=new Date() && survey.lastDate>=new Date() && (req.session[survey.accessLVL+'Model'] != undefined || req.session[survey.accessLVL] != undefined)) surveytemplate=survey
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
            if(!(survey.firstDate<=new Date() && survey.lastDate>=new Date()) || !((req.session[survey.accessLVL+'Model'] != undefined) || (req.session[survey.accessLVL] != undefined))) return;
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

}

router.get('/:name', CreateSurvey.getPage);
router.post('/:name/reg', CreateSurvey.reg);


module.exports.router = router;