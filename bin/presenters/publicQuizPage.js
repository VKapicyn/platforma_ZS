const express = require('express');
const router = express.Router();

class PublicQuiz {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница публичных опросов'
        });
    }
}

//Роутинг внутри страницы
router.get('/', PublicQuiz.getPage);

module.exports.router = router;