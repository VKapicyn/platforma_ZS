const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5')

class AuthAdmin {
    static getPage(req, res, next) {
        res.render('logPageAdmin.html')
    }

    static async login(req,res,next){
         let account = await adminModel.findOne({login:req.body.login})
        if (account.password == toHash(req.body.password)){    
             req.session.admin = {id: account._id, login: account.login};
             req.session.save();
             console.log(req.session.admin);
             
             res.end();

        }
        else {
            //инфа об ошибке ?
            res.redirect('/logPageAdmin.html')
        }
    }
    static logout(req, res, next){
        delete req.session.admin;
        res.render('logPageAdmin.html')
    }
}

router.get('/', AuthAdmin.getPage);
router.post('/', AuthAdmin.login);
router.delete('/', AuthAdmin.logout)

module.exports.router = router;