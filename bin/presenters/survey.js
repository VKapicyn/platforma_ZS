const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

class CreateSurvey{
    static async getPage(req, res, next) {
        let surveytemplate;
        try{
            let survey =  await surveytemplateModel.findOne({'name':req.params.name});
            if(survey.firstDate<=new Date() && survey.lastDate>=new Date()) surveytemplate=survey
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
            res.end('Все поля должны быть заполнены'); console.log(2)
        }
        else{
        try {
            let survey = await surveytemplateModel.findOne({'name':req.params.name})
            if(survey == null) {err='ошибка'}
            else{
            survey.update({name:req.params.name},{result: survey.result.push(req.body)})
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