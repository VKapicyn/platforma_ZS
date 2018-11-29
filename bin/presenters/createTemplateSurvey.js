const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const send = require('./../utils/email').Send;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const delFile = require('./../utils/uploader').Delete;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage()
const upload = multer({ storage });


class CreateSurvey{
    static getPage(req, res, next) {
        res.render('CreateSurvey.html')
    }
    static async reg(req,res,next){
        let err='успешно';
        if( !req.body.name || !req.body.accessLVL || !req.body.data || !req.body.firstDate || !req.body.lastDate) {
            res.end('Все поля должны быть заполнены'); 
        }
        else{
        try {
            if(await surveytemplateModel.findOne({'name':req.body.name}) != null) {err='это имя занято'};
            let form = new surveytemplateModel({
                name: req.body.name,
                firstDate: req.body.firstDate,
                lastDate: req.body.lastDate,
                accessLVL: req.body.accessLVL,
                data: req.body.data,
                description: req.body.description
            });
            form.save();
            let st= await stakeholderModel.find();
                let content = {name:req.body.name};
                for (let i=0; i<st.length; i++)
                send(st[i], 4 , content);
        } catch (e) {
            console.log(e)
        }
    }
        res.end(err);
    }
    static async showResult(req,res,next){

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
    static async getSurvey(req, res, next) {
        
            let survey =  await surveytemplateModel.findOne({'name':req.params.name});
        res.render('SurveyForAdmin.html', {
            result: survey.result,
            question: survey.data.question
        });
    
    }
    static async regAnnotation(req, res, next) {
        try{
        if((req.file.contentType == 'application/pdf')||(req.file.contentType == 'text/plain')){
            let survey = await surveytemplateModel.findOne({'name':req.params.name})
            survey.annotation={text:req.body.text_an,file:req.file.filename,date:Date.now().toString()}
            survey.save();
                let st= await stakeholderModel.find();
                let content = {name:survey.name};
                for (let i=0; i<st.length; i++)
                send(st[i], 4 , content);
            
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
            console.log(e)
            res.end('error')
        }
    }

}

router.get('/', CreateSurvey.getPage);
router.post('/reg', CreateSurvey.reg);
router.get('/res', CreateSurvey.showResult);
router.get('/res/:name', CreateSurvey.getSurvey);
router.post('/res/:name',upload.single('file_an'), CreateSurvey.regAnnotation);

module.exports.router = router;