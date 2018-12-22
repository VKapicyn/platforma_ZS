const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5')

class Auth {
    static getPage(req, res, next) {
        res.render('logPage.html',{
            alert: req.params.conf
        });
        console.log(req.params);
    }

    static async login(req,res,next){
        let account = await stakeholderModel.findOne({login: req.body.login})
        if (account!=null && account!=undefined) {
            if (account.password == toHash(req.body.password)){  
                req.session.stakeholder = {id: account._id, login: account.login};
                req.session.save();
                res.redirect('/lk');
            }
        }
        else
        res.redirect('/loginstakeholder/errstake');
    }
    static logout(req, res, next){
        delete req.session.stakeholder;
        res.render('logPage.html')
    }
}

router.get('/', Auth.getPage);
router.post('/', Auth.login);
router.delete('/', Auth.logout);
router.get('/:conf', Auth.getPage);

module.exports.router = router;