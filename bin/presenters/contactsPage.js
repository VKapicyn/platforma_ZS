const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;

class Contacts {
    static getPage(req, res, next) {
        res.render('contacts.html');
    }
}

//Роутинг внутри страницы
router.get('/', Contacts.getPage);

module.exports.router = router;