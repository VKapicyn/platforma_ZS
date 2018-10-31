const express = require('express');
const router = express.Router();
const stakeholderModel = require('./../models/stakeholder').stakeholderModel;
const toHash = require('md5');


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Registration {
    static getPage(req, res, next) {
        res.render('regPage.html')
    
    }

    //async можно прописывать прям тут
    static async reg(req,res,next){
        let err;
        if( !req.body.login || !req.body.password) {
            err = 'Все поля должны быть заполнены'; 
        }

        //проверка на уникальность логина должна быть на уровне схемы данных, если такой логин есть - выкинет ошибку на сохранении
        try {
            let account = new stakeholderModel({
                'login': req.body.login,
                'password': toHash(req.body.password),
                'state': 0,
                'key': getRandomInt(1000000000, 9999999999)
            });
            account.save();
            //res.json('http://localhost:8080/registration/conf/'+account.key)
        } catch (e) {
            err = 'логин занят';
        }
        
        res.render('logPage.html', {account: err || account});
    }
    static async conf(req, res, next){
        try{
            await stakeholderModel.update({key:req.params.num},{state:1},function(err, result){
     
                console.log('update!')
                if(err) return console.log(err);
                console.log(result);
                res.end();
            });
        }
        catch(e) {console.log(e);res.end();}
    }    
}

router.get('/', Registration.getPage);
router.post('/', Registration.reg);
router.get('/conf/:num', Registration.conf);

module.exports.router = router;