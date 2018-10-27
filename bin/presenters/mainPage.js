const express = require('express');
const router = express.Router();
const userModel = require('./../models/userModel').userModel;

class Main {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я главная страница'
        });
    }
    static async getPageByUserId(req, res, next) {
        let user;
        try{
            user =  await userModel.findById(req.params.id);
        }
        catch(e) {user = e}
        res.render('mainPage.html', {
            parametr: user,
        });
    }
}

//Роутинг внутри страницы
router.get('/', Main.getPage);
router.get('/:id', Main.getPageByUserId);

module.exports.router = router;