const express = require('express');
const router = express.Router();

class PersonMap {
    static getPage(req, res, next) {
        res.render('personmap.html');
    }
}

//Роутинг внутри страницы
router.get('/', PersonMap.getPage);

module.exports.router = router;