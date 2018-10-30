const express = require('express');
const router = express.Router();

class Events {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница мероприятий'
        });
    }
}

//Роутинг внутри страницы
router.get('/', Events.getPage);

module.exports.router = router;