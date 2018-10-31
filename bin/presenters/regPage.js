const express = require('express');
const router = express.Router();
const stakeholder = require('./../models/stakeholder').stakeholder;
const toHash = require('md5')

class Main {
    static getPage(req, res, next) {
        res.render('regPage.html')
    
    }
    static reg(req,res,next){
        console.log(req.body.login)
        async function fun(){
        if( !req.body.login || !req.body.password){console.log(req.body);res.json({'error':'Все поля должны быть заполнены'});return;}
        let accountlogin = await stakeholder.findOne({"login":req.body.login});
        console.log(accountlogin)
        if (accountlogin != null) res.json({'error':'логин занят'})
        else {
            let account = new stakeholder({"login":req.body.login,"password":toHash(req.body.password),"state":0});
            account.save();
            //res.json('аккаунт создан');
            res.render('logPage.html')
        }
    }
    fun();
    }
    
    }

router.get('/', Main.getPage);
router.post('/',Main.reg);

module.exports.router = router;