const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5');
const userModel = require('../models/userModel').userModel;
const send = require('./../utils/email').Send;

class Registration {
    static getPage(req, res, next) {
        res.render('regPage.html')
    }
    static async reg(req,res,next){
        let err;
        // if( !req.body.login || !req.body.password || !req.body.email) {
        //     err = 'Все поля должны быть заполнены'; return;
        // }

        try {
            let account = new stakeholderModel({
                'login': req.body.login +'6',
                'password': toHash(req.body.password),
                'email': req.body.email,
                'key': toHash(req.body.login+Date.now().toString())
            });
            
            account.save();
            send(account, 1 , account);
        } catch (e) {
            err = 'логин занят';
        }
        
        res.render('logPage.html', );
    }
    static async conf(req, res, next){
        let user = await userModel.findOne({key: req.params.num});
        if (user){
            if (user.state == 0) {
                user.state = 1;
                user.save();
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