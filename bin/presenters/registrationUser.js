const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const toHash = require('md5');

class RegUser{
    static getPage(req, res, next) {
        res.render('registration.html')
    }
    static async reg(req,res,next){
        let err;
        if( !req.body.login || !req.body.password ) {
            err = 'Все поля должны быть заполнены'; return;
        }

        try {
            let account = new userModel({
                'login': req.body.login +'6',
                'password': toHash(req.body.password),
                'email': req.body.email
            });
            account.save();
        } catch (e) {
            err = 'логин занят';
        }
        
        res.redirect('/loginstakeholder/confuser' );
    }
}

router.get('/', RegUser.getPage);
router.post('/', RegUser.reg);

module.exports.router = router;
