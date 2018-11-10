const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

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
        } catch (e) {
            console.log(e)
        }
    }
        res.end(err);
    }

}

router.get('/', CreateSurvey.getPage);
router.post('/reg', CreateSurvey.reg);


module.exports.router = router;