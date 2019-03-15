const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5');
const Recaptcha = require('recaptcha').Recaptcha;

let PUBLIC_KEY  = require('../../config').public_key,
    PRIVATE_KEY = require('../../config').private_key,
    recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);

class RegUser{
    static getPage(req, res, next) {  
        res.render('registration.html', {
            captcha: recaptcha.toHTML()
        })
    }
    static async reg(req,res,next){
        let err;
        recaptcha.verify(async (success, error_code) => {
            console.log(success, error_code)
            if (success) {
                if( !req.body.login || !req.body.password ) {
                    err = 'Все поля должны быть заполнены'; return;
                }
            }
            else {
                err = 'Капча введена неверно!'
            }
        });

        try {
            let test = await shModel.findOne({login:req.body.login});
            if (test==null || test ==undefined)
            {
                let account = new userModel({
                    'login': req.body.login,
                    'password': toHash(req.body.password),
                    'email': req.body.email
                });
                account.save();
            }
            else throw 'логин занят'
        } catch (e) {
            err = 'логин занят';
        }
        
        res.redirect('/loginstakeholder/confuser' );
    }
}

router.get('/', RegUser.getPage);
router.post('/', RegUser.reg);

module.exports.router = router;
