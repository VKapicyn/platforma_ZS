const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5');
class Lk {
    static getPage(req, res, next) {
        if (req.session.admin) {
        res.render('lk.html', {
            parametr: 'Я страница личного кабинета',
            admin: true
        });
        }
        else res.render('mainPage.html', {
            parametr: 'Я страница личного кабинета',
        });
    }
    static async changePassord(req,res,next){
        // if(req.session.admin){
        // сcon
        // adminModel.update({login: req.session.admin.login},{$set: {password: toHash(req.body.password)}});
        // }
        const user = adminModel.find({login: req.session.admin.login})
        user.password =  toHash(req.body.password);
        user.save();
        
    }
}

//Роутинг внутри страницы
router.get('/', Lk.getPage);
router.post('/', Lk.changePassord);

module.exports.router = router;