const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');//require('./../../server').mongoose;

let userSchema = mongoose.Schema({
    login: String,
    password: String, // захешировать в MD5
    email: String
});

userSchema.methods = {
    //методы конкретного объекта. В большинстве случаев можно обойтись без них, довольствуясь методами mongoose
}

userSchema.statics = {
    read: async function (req, res, next) {
        //TODO: парсер req.params
        res.json(JSON.stringify(await userModel.find({})));
    },
    create: function (req, res, next) {
        let user = new userModel(req.body);
        user.save();
        res.json(JSON.stringify(user))
    },
    update: async function (req, res, next) {
        let user = await userModel.findById(req.body.id);
        //TODO: перезапись полей по найденным параметрам
        res.json('обновил');
    },
    delete: async function (req, res, next) {
        let user = await userModel.findById(req.body.id);
        user.remove();
        res.json(`${req.body.id} - удалён`);
    }
}

let userModel = mongoose.model('user', userSchema);
module.exports.userModel = userModel;

//CRUD API
router.get('/', userModel.read);
router.post('/', userModel.create);
router.put('/', userModel.update);
router.delete('/', userModel.delete);

module.exports.router = router;