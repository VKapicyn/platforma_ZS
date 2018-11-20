const express = require('express');
const router = express.Router();
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const delFile = require('../utils/uploader').Delete;
const multer  = require('multer');
const newStorage = require('../utils/uploader').newStorage;
const storage = newStorage()
const upload = multer({ storage });

class Negotiation{
    static async show(req, res, next){
        try{
        let file = await fileNegotiationModel.find();
        let name = [];
        for (let i=0;i<file.length;i++){
            if(file[i].access.indexOf(req.session.stakeholderModel.login)>=0)
            name=[...name,file[i].name]
        }
        res.render('showFileNegotiation.html',{
            name:name
        })
        }
        catch(e){
            res.end('error')
        }
    }
    static async getfile(req, res, next){
        try{
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        res.render('fileNegotiation.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            comment: fileN.comment,
            dialog: fileN.account[req.session.stakeholderModel.login]
        });
    }
    catch(e){
        res.end('error')
    }
    }
    static async reg(req, res, next){
        try{
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        fileN.account[req.session.stakeholderModel.login].push({log:req.session.stakeholderModel.login,com:req.body.comment})
        fileN.file = req.file.filename;
        fileN.save()
        res.render('fileNegotiation.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            comment: fileN.comment,
            dialog: fileN.account[req.session.stakeholderModel.login]
        });
    }
    catch(e){
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        fileN.account[req.session.stakeholderModel.login].push({log:req.session.stakeholderModel.login,com:req.body.comment})
        fileN.save()
        res.render('fileNegotiation.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            comment: fileN.comment,
            dialog: fileN.account[req.session.stakeholderModel.login]
        });
    }
    }
}


router.get('/',Negotiation.show);
router.get('/name:name',Negotiation.getfile);
router.post('/name:name',upload.single('file'),Negotiation.reg);

module.exports.router = router;