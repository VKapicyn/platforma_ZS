const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel').userModel;
// const Send = require('./../utils/email').Send;

class Feedback {
    static getPage(req, res, next) {
        res.render('feedbackPage.html', {
            parametr: 'Я страница обратной связи'
        });
    }
    static send(req,res,next){
        let mess = {
            name : req.body.name,
            content : req.body.content,
            email : req.body.email
        }
        // Send('',feed,mess);
    }
}

//Роутинг внутри страницы
router.get('/', Feedback.getPage);
router.post('/send', Feedback.send);

module.exports.router = router;