const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const toHash = require('md5')

class AuthUser {
    static getPage(req, res, next) {
        res.render('logPage.html')
    }

    static async login(req,res,next){
        let account = await userModel.findOne({login: req.body.login})

        if (account.password == toHash(req.body.password)){    
            req.session.user = {id: account._id, login: account.login};
            req.session.save()
            res.end()
        }
        else {
            //инфа об ошибке ?
            res.render('logPage.html')
        }
    }
    static logout(req, res, next){
        delete req.session.user;
        res.render('logPage.html')
    }
}

router.get('/', AuthUser.getPage);
router.post('/', AuthUser.login);
router.post('/logout', AuthUser.logout)

module.exports.router = router;