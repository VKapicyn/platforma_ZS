const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5')

class Auth {
    static getPage(req, res, next) {
        res.render('logPage.html')
    }

    static async login(req,res,next){
         let account = await adminModel.findOne({login:req.body.login})
         console.log(req.body.password);
        if (account.password == req.body.password){    
             req.session.admin = {id: account._id, login: account.login};
             req.session.save();
             res.end();
        }
        else {
            //инфа об ошибке ?
            res.render('logPage.html')
        }
    }
    static logout(req, res, next){
        console.log(req.session);
        if (delete req.session.admin) console.log('done');
        res.render('logPage.html')
    }
}

router.get('/', Auth.getPage);
router.post('/', Auth.login);
router.delete('/', Auth.logout)

module.exports.router = router;