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
        let err = 'err';
        recaptcha.verify(req, async (error_code) => {
            if (!error_code) {
                if( !req.body.login || !req.body.password || !req.body.email) {
                    err = 'Все поля должны быть заполнены'; //return;
                }
                let test2 = await userModel.findOne({login:req.body.login});
                if( test2 != null && test2 != undefined) {
                    err = 'логин занят'; //return;     
                }          
            }
            else {
                err = 'Капча введена неверно!'
            }
            try {
                if (err == 'err'){
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
                    else { 
                        err= 'логин занят';
                        //return;
                    }
                }
            } catch (e) {
                err = e;
            }
            
            if ( err != 'err')
                res.render('registration.html', {error:err})
            else
                res.redirect('/loginstakeholder/confuser' );
        });
    }
}

router.get('/', RegUser.getPage);
router.post('/', RegUser.reg);

module.exports.router = router;
