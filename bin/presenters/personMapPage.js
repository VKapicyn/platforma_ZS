const express = require('express');
const router = express.Router();
const shModel = require('../models/stakeholderModel').stakeholderModel;

class PersonMap {
    static async getPage(req, res, next) {
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        res.render('personmap.html',{
            sh:sh
        });
    }
}

//Роутинг внутри страницы
router.get('/', PersonMap.getPage);

module.exports.router = router;