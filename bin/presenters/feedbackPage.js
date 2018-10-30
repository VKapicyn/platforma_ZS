const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;

class Feedback {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница обратной связи'
        });
    }
}

//Роутинг внутри страницы
router.get('/', Feedback.getPage);

module.exports.router = router;