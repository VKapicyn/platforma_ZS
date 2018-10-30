const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;

class Instruction {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница инструкции'
        });
    }
}

//Роутинг внутри страницы
router.get('/', Instruction.getPage);

module.exports.router = router;