const express = require('express');
const router = express.Router();
const userModel = require('./../models/userModel').userModel;

class Main{
    static getPage(req, res, next){
        res.redirect('/main')
    }
}

router.get('/', Main.getPage);

module.exports.router = router;