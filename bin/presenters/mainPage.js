const express = require('express');
const router = express.Router();
const userModel = require('./../models/userModel').userModel;
const eventModel = require('../models/eventModel').eventModel;
const shModel = require('../models/stakeholderModel').stakeholderModel;

class Main {
    static async getPage(req, res, next) {
        let sh = await shModel.findOne({login:req.session.stakeholder.login})
        let events = await eventModel.find({})
        events.sort((a,b)=>{
            return b.eventDate - a.eventDate
        })
        res.render('mainPage.html', {
            events:events.slice(0,4),
            sh:sh
        });
    }
    static async getPageByUserId(req, res, next) {
        let user;
        try{
            user =  await userModel.findById(req.params.id);
        }
        catch(e) {user = e}
        res.render('mainPage.html', {
            parametr: user,
        });
    }
}

//Роутинг внутри страницы
router.get('/', Main.getPage);
router.get('/:id', Main.getPageByUserId);

module.exports.router = router;