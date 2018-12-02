const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5')

class Auth {
    static getPage(req, res, next) {
        res.render('logPage.html')
    }

    static async login(req,res,next){
        let account = await userModel.findOne({login: req.body.login})
        if (account.password == toHash(req.body.password)){  
        
            switch(account.tyoeOfUser){
                case ('user'):
                    req.session.user = {id: account._id, login: account.login};
                    req.session.save();
                    res.end();
                break;
                case ('stakeholder'):
                    req.session.stakeholder = {id: account._id, login: account.login};
                    req.session.save();
                    res.end();
                break;
                case ('admin'):
                    req.session.admin = {id: account._id, login: account.login};
                    req.session.save();
                    res.end();
                break;
            }
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