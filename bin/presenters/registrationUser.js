const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5');
const recaptcha = require('../models/recaptcha').recaptcha;

class RegUser{
    static getPage(req, res, next) {  
        res.render('registration.html', {
        })
    }
    static async reg(req,res,next){
        let err = '';
        recaptcha.verify(req, async (error_code) => {
            if (error_code) {
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
        
        if ( err != '')
            res.render('registration.html', {
                err
            })
        else
            res.redirect('/loginstakeholder/confuser' );
    }
}

router.get('/', RegUser.getPage);
router.post('/', RegUser.reg);

module.exports.router = router;
