const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;

class Instruction {
    static async getPage(req, res, next) {
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        res.render('instruction.html',{
            session: req.session,
            sh:sh
        });
    }
}

//Роутинг внутри страницы
router.get('/', Instruction.getPage);

module.exports.router = router;