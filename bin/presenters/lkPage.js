const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5');
const shModel = require('../models/stakeholderModel').stakeholderModel;
class Lk {
    static async getPage(req, res, next) {
        if (req.session.admin) {
            let sh = await shModel.find({state: '1'},(err) =>{
                console.log(err);
            });
            console.log(sh);
        res.render('lk.html', {
            parametr: 'Я страница личного кабинета',
            admin: true,
            sHolder: sh
        });
        }
        else res.render('mainPage.html', {
            parametr: 'Я страница личного кабинета',
        });
    }
    static  confirmSH(req,res,next){
        console.log(req.query.agree);
        
        shModel.findOneAndUpdate({_id: req.params.id },{$set:{state: req.query.agree}} , (err) => {
            console.log(err);
       });
       res.redirect('/lk');
    }
    static async changePassword(req,res,next){
    try{
        let model = req.session.admin?adminModel:shModel;
        const user = await adminModel.find({login: req.session.admin.login})
        console.log(user);
        model.findOneAndUpdate({login: req.session.admin.login},{$set: {password: toHash(req.body.password)}},(err) => {
            console.log(err);
        });
        res.redirect('/lk');
        
    }
    catch(e) {
        console.log(e);

    }
    
    }
}

//Роутинг внутри страницы
router.get('/', Lk.getPage);
router.post('/', Lk.changePassword);
router.get('/:id',adminModel.isAdminLogged,Lk.confirmSH);

module.exports.router = router;