const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5')

class Auth {
    static getPage(req, res, next) {
        res.render('logPage.html')
    }

    static async login(req,res,next){
        let account = await stakeholderModel.findOne({login: req.body.login})
        if (account.password == toHash(req.body.password)){  
            req.session.stakeholder = {id: account._id, login: account.login};
            req.session.save();
            res.redirect('/lk');
        }
        else { 
            //инфа об ошибке ?
            // res.redirect('lk.html');
        }
    }
    static logout(req, res, next){
        delete req.session.stakeholder;
        res.render('logPage.html')
    }
}

router.get('/', Auth.getPage);
router.post('/', Auth.login);
router.delete('/', Auth.logout)

module.exports.router = router;