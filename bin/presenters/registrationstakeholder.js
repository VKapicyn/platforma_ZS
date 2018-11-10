const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5');

class Registration {
    static getPage(req, res, next) {
        res.render('regPage.html')
    }
    static async reg(req,res,next){
        let err;
        if( !req.body.login || !req.body.password) {
            err = 'Все поля должны быть заполнены';  return;
            //TODO: проверка на длину пароля и длину логина
        }

        try {
            let account = new stakeholderModel({
                'login': req.body.login,
                'password': toHash(req.body.password),
                'state': 0,
                'key': toHash(req.body.login+Date.now().toString()) 
            });
            account.save();
        } catch (e) {
            err = 'логин занят';
        }
        
        res.render('logPage.html', );
    }
    static async conf(req, res, next){
        let sh = await stakeholderModel.findOne({key: req.params.num});
        if (sh){
            if (sh.status == 0) {
                sh.status = 1;
                sh.save();
                res.send('подтвержден')
            }
        } else
            res.send('ошибка')
    }    
}

router.get('/', Registration.getPage);
router.post('/', Registration.reg);
router.get('/conf/:num', Registration.conf);

module.exports.router = router;