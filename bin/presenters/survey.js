const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const delFile = require('./../utils/uploader').Delete;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage()
const upload = multer({ storage });

class Survey{
    static async getPage(req, res, next) {
        let surveytemplate;
        try{
            let survey =  await surveytemplateModel.findOne({name:req.params.name});
            if(survey.firstDate<=new Date() && survey.lastDate>=new Date() && (req.session[survey.accessLVL+'Model'] != undefined || req.session[survey.accessLVL] != undefined) || survey.annotation) {surveytemplate=survey}
            else {{res.end('залогинься!(либо опрос окончен)');return;}}
        }
        catch(e) {surveytemplate = e}
        res.render('Survey.html', {
            description: surveytemplate.description,
            name: surveytemplate.name,
            question: surveytemplate.data.question,
            answer: surveytemplate.data.answer,
            annotation: surveytemplate.annotation.text,
            file: `/file/${surveytemplate.annotation.file}`
        });
    }
    static async reg(req,res,next){
        let err='успешно';
        if( !req.params.name || !req.body.answer ) {
            res.end('Все поля должны быть заполнены');
        }
        else{
        try {
            let survey = await surveytemplateModel.findOne({name:req.params.name})
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
    static async showResult(req,res,next){

        if(req.session.admin){
            let mas_n=[];
            let mas_d=[];
            let survey = await surveytemplateModel.find();
            for(let i=0;i<survey.length;i++){
                if (survey[i].firstDate<=new Date() && survey[i].lastDate>=new Date()){
                    mas_n=[...mas_n,survey[i].name];
                    mas_d=[...mas_d,survey[i].description];
                }
            }
            res.render('AllSurveyForAdmin.html', {
                mas_name:mas_n,
                mas_desc:mas_d
            });
        }
        else{
           res.end('error')
        }
    }
    static async getSurvey(req, res, next) {
        if(req.session.admin){
   
            let survey =  await surveytemplateModel.findOne({'name':req.params.name});
        res.render('SurveyForAdmin.html', {
            result: survey.result,
            question: survey.data.question
        });
    }
    else{
        res.end('error')
    }
    }
    static async regAnnotation(req, res, next) {
        try{
        if((req.file.contentType == 'application/pdf')||(req.file.contentType == 'text/plain')){
            let survey = await surveytemplateModel.findOne({'name':req.params.name})
            survey.annotation={text:req.body.text_an,file:req.file.filename}
            survey.save();
            res.render('SurveyForAdmin.html', {
                result: survey.result,
                question: survey.data.question,
                response:'Аннотация добавлена'
            });
        }
        else
            {   
                delFile(req.file.filename);
                res.render('SurveyForAdmin.html', {
                    result: survey.result,
                    question: survey.data.question,
                    response:'Ошибка'
                });
            }
        }
        catch(e){
            res.end('error')
        }
    }

}

router.get('/', Survey.show);
router.get('/name:name', Survey.getPage);
router.post('/name:name/reg', Survey.reg);
router.get('/admin', Survey.showResult);
router.get('/admin/:name', Survey.getSurvey);
router.post('/admin/:name',upload.single('file_an'), Survey.regAnnotation);


module.exports.router = router;