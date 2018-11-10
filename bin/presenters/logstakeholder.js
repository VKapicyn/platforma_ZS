const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5')

class Auth {
    static getPage(req, res, next) {
        res.render('logPage.html')
    }

    static async login(req,res,next){
        let account = await stakeholderModel.findOne({login: req.body.login})
        if (account.password == toHash(req.body.password)){   
            req.session.stakeholderModel = {id: account._id, login: account.login}
        }
        else { 
            //инфа об ошибке ?
            res.render('logPage.html')
        }
    }
    static logout(req, res, next){
        delete req.session.stakeholderModel;
        res.render('logPage.html')
    }
}

router.get('/', Auth.getPage);
router.post('/', Auth.login);
router.delete('/', Auth.logout)

module.exports.router = router;