const express = require('express');
const router = express.Router();

class Registration {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница регистрации'
        });
    }
}

//Роутинг внутри страницы
router.get('/', Registration.getPage);

module.exports.router = router;