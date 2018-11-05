const express = require('express');
const router = express.Router();
const surveytemplateModel = require('../models/surveytemplateModel').surveytemplateModel;

class CreateSurvey{
    static getPage(req, res, next) {
        res.render('CreateSurvey.html')
    }
    static async reg(req,res,next){
        let err="успешно";
        if( !req.body.name || !req.body.accessLVL || !req.body.data) {
            res.end('Все поля должны быть заполнены'); 
        }
        else{
        try {
            if(await surveytemplateModel.findOne({'name':req.body.name}) != null) {err="error"};
            let form = new surveytemplateModel({
                'name': req.body.name,
                'firstDate': new Date(),
                'lastDate': new Date().setDate(new Date().getDate()+14),
                'accessLVL': req.body.accessLVL,
                'data': req.body.data
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