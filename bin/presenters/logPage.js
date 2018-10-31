const express = require('express');
const router = express.Router();
const stakeholder = require('./../models/stakeholder').stakeholder;
const toHash = require('md5')

class Main {
    static getPage(req, res, next) {
        res.render('logPage.html')
    
    }
    static log(req,res,next){
        async function fun(){
            let account = await stakeholder.findOne({"login":req.body.login})
            console.log(account)
            if(account.password == req.body.password){
                req.session.user={user : toHash(req.body.login)}
                console.log(req.session.user)

            }
            else{
                res.redirect('/');
            }
        }
        fun()
    }
    static logout(req,res,next){
        delete req.session.user;
        console.log(req.session.user)
        res.redirect('/')
    }
    }

router.get('/', Main.getPage);
router.post('/',Main.log);
router.delete('/',Main.logout)

module.exports.router = router;