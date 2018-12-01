const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;
const reportModel = require('../models/reportModel').reportModel;

class Search{
    static async getResult(req, res, next){
        try{
            let mas_survey=[]
            let survey = await surveytemplateModel.find();
            for(let i=0; i<survey.length; i++){
                if(survey[i].name == req.body.search || survey[i].description == req.body.search) mas_survey.push(survey[i])
            }
            console.log(mas_survey)
        }
        catch(e){

        }
    }
}

router.post('/',Search.getResult);

module.exports.router = router;