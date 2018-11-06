const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');//require('./../../server').mongoose;



let adminShema = mongoose.Schema({
    login: String,
    password: String, 
    email: String
});

adminShema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await adminShema.findById(req.body.eventid)));
    },
    update: async function (req, res, next) {
        let admin = await event.findById(req.body.id);
        //TODO: перезапись полей по найденным параметрам
        //TODO: ограничение на выполнение, только админ может вызывать метод
        res.json('обновил');
    },
    isAdminLogged: function (req, res, next) {
        console.log(req.session.admin);
        if(req.session.admin){
            return next()
        }
        else res.json('нет прав на выполнение операции');
    }
    

}
let adminModel = mongoose.model('admin', adminShema);
module.exports.adminModel = adminModel;

//CRUD API 
router.get('/', adminModel.read);
router.put('/', adminModel.update);

module.exports.router = router;