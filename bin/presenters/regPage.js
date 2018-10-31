const express = require('express');
const router = express.Router();
const stakeholder = require('./../models/stakeholder').stakeholderModel;
const toHash = require('md5')

class Registration {
    static getPage(req, res, next) {
        res.render('regPage.html')
    
    }

    //async можно прописывать прям тут
    static async reg(req,res,next){
        let err;
        if( !req.body.login || !req.body.password) {
            err = 'Все поля должны быть заполнены'; 
        }

        //проверка на уникальность логина должна быть на уровне схемы данных, если такой логин есть - выкинет ошибку на сохранении
        try {
            let account = new stakeholderModel({
                'login': req.body.login,
                'password': toHash(req.body.password),
                'state': 0
            });
            account.save();
        } catch (e) {
            err = 'логин занят';
        }
        
        res.render('logPage.html', {account: err || account});
    }    
}

router.get('/', Registration.getPage);
router.post('/', Registration.reg);

module.exports.router = router;