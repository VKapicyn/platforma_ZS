const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;

class Instruction {
    static getPage(req, res, next) {
        res.render('instruction.html',{
            session: req.session
        });
    }
}

//Роутинг внутри страницы
router.get('/', Instruction.getPage);

module.exports.router = router;