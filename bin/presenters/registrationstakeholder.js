const express = require('express');
const router = express.Router();
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const toHash = require('md5');
const send = require('./../utils/email').Send;

class Registration {
    static getPage(req, res, next) {
        res.render('regPage.html')
    }
    static async reg(req,res,next){
        let err;
        // if( !req.body.login || !req.body.password || !req.body.email) {
        //     err = 'Все поля должны быть заполнены'; return;
        // }

        try {
            console.log(req.body)
            if(req.body.password != req.body.password1) {
                err = 'пароли должны совпадать'; 
            }
            else if(await stakeholderModel.findOne({login: req.body.login})){
                err = 'логин занят'
            }
            else{
            let account = new stakeholderModel({
                login: req.body.login,
                password: toHash(req.body.password),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                patronymic: req.body.patronymic,
                email: req.body.email,
                position: req.body.position,
                organization: req.body.organization,
                group: [req.body.group_select,req.body.group_input],
                time: req.body.time_select,
                interest: req.body.interest,
                history: req.body.history,
                contact_information: req.body.contact_information,
                address: req.body.address,
                regDate: new Date(),
                state: 0,
                key: toHash(req.body.login+Date.now().toString()) 
            });
            console.log(1)
            account.save();
            send(account, 1 , account);
        }
        } catch (e) {
            err = 'логин занят';
        }
        console.log(err)
        if (err) res.render('registration.html',{error:err})
        else res.render('logPage.html', );
    }
    static async conf(req, res, next){
        let user = await stakeholderModel.findOne({key: req.params.num});
        if (user){
            if (user.state == 0) {
                user.state = 1;
                user.save();
                res.send('подтвержден')
            }
        } else
            res.send('ошибка')
    }    
}

router.get('/', Registration.getPage);
router.post('/', Registration.reg);
router.get('/conf/:num', Registration.conf);

module.exports.router = router;