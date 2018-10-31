const express = require('express');
const router = express.Router();

class Lk {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница личного кабинета'
        });
    }
}

//Роутинг внутри страницы
router.get('/', Lk.getPage);

module.exports.router = router;