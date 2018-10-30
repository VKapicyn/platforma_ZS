const express = require('express');
const router = express.Router();

class PersonMap {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница карт заинтересованных сторон'
        });
    }
}

//Роутинг внутри страницы
router.get('/', PersonMap.getPage);

module.exports.router = router;