const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;

class Contacts {
    static async getPage(req, res, next) {
        let sh = await shModel.findOne({login:req.session.stakeholder.login})
        res.render('contacts.html',{
            sh:sh
        });
    }
}

//Роутинг внутри страницы
router.get('/', Contacts.getPage);

module.exports.router = router;