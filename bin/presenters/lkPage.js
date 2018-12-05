const express = require('express');
const router = express.Router();
const adminModel = require('../models/adminModel').adminModel;
const toHash = require('md5');
const shModel = require('../models/stakeholderModel').stakeholderModel;
const Json2csvParser = require ( 'json2csv' ) . Parser ;
class Lk {
    static async getPage(req, res, next) {
        res.render('lk.html', {
            parametr: 'Я страница личного кабинета',
            admin: true
        });
    }
    static async getCsv(req,res,next){
        let sh = await shModel.find({state: '1'},(err) =>{
            console.log(err);
        });
        let fields = [{
                        label:'Имя',
                        value:'firstname'
                    },
                    {
                        label:'Фамилия',
                        value: 'lastname'
                    },
                    {
                        label:'Отчество',
                        value: 'patronymic'
                    },
                    {
                        label:'Организация',
                        value: 'organization'
                    },
                    {
                        label:'Интересы',
                        value:'interest'
                    },
                    {
                        label:'Контактная иформация',
                        value:'contact_information'
                    },
                    {
                        label:'Адрес',
                        value:'address'
                    },
                    {
                        label:'Соц. сети',
                        value:'social_network'
                    }];
        // let fieldsname=['Имя','Фамилия','Отчество','Организация','Интересы','Контактная иформация','Адрес','Соц. сети'];
        let json2csvParser = new Json2csvParser ( {  fields  } ) ;    
        const csv = json2csvParser.parse( sh ) ; 
        console.log(csv);
        res.set('Content-Type', 'application/octet-stream');
        res.attachment('shRegistration.csv');
        res.status(200).send(csv);  
       
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
router.get('/confirm/:id',adminModel.isAdminLogged,Lk.confirmSH);
router.get('/csv',adminModel.isAdminLogged,Lk.getCsv);

module.exports.router = router;