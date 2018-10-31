const express = require('express');
const router = express.Router();
const eventsModel = require('./../models/eventsModel').eventsModel;


class Events {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница мероприятий'
        });
    }
    static async getPageByEventId(req, res, next) {
        let event;
        try{
            event =  await eventsModel.findById(req.params.id);
        }
        catch(e) {event = e}
        res.render('events.html', {
            parametr: event,
        });
    }
}

//Роутинг внутри страницы
router.get('/', Events.getPage);
router.get('/:id', Events.getPageByEventId);
module.exports.router = router;