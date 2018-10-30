const express = require('express');
const router = express.Router();

class PublicRef {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница публичных отчетов'
        });
    }
}

//Роутинг внутри страницы
router.get('/', PublicRef.getPage);

module.exports.router = router;