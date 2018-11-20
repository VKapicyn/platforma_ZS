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
    static async getPage(req, res, next){
        let stakeholders = await stakeholderModel.find()
        res.render('regFileNegotiationForAdmin.html',{
            stakeholders:stakeholders
        })
    }
    static async regfile(req, res, next){
        try{
            if((req.file.contentType == 'application/pdf')||(req.file.contentType == 'text/plain')){
                let obj = {};
                let mas = [];
                if(Array.isArray(req.body.access)){mas = [...mas,...req.body.access]}
                else {mas.push(req.body.access)}
                for (let i=0;i<mas.length;i++){obj[mas[i]]=[1]}
                console.log(obj)
                let file = new fileNegotiationModel({
                    name: req.body.name,
                    description: req.body.description,
                    file: req.file.filename,
                    access: req.body.access,
                    comment: req.body.comment,
                    account: obj
                });
                file.save();
                let stakeholders = await stakeholderModel.find()
                res.render('regFileNegotiationForAdmin.html',{
                    stakeholders:stakeholders,
                    response:"Успешно"
                })
            }
            else
                {   
                    delFile(req.file.filename);
                    res.end('error')
                }
            }
            catch(e){
                console.log(e)
                res.end('error')
            }
    }
    static async show(req, res, next){
        try{
        let file = await fileNegotiationModel.find();
        let name = [];
        for (let i=0;i<file.length;i++){
            name=[...name,file[i].name]
        }
        res.render('showFileNegotiationForAdmin.html',{
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
        res.render('fileNegotiationForAdmin.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            access: fileN.access,
            agreement: fileN.agreement,
        });
    }
    catch(e){
        res.end('error')
    }
    }
    static async getSt(req, res, next){
        try{
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        res.render('fileNegotiationForAdminDialog.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            access: fileN.access[req.params.login],
            agreement: fileN.agreement,
            dialog: fileN.account
        });
    }
    catch(e){
        res.end('error')
    }
    }
    static async dialog(req, res, next){
        try{
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        let obj={log: 'admin', com: req.body.dialog};
        JSON.stringify(obj);
        console.log(obj)
        fileN.account[req.params.login].push(obj);
        //fileN.account[req.params.login]=[...fileN.account[req.params.login],obj]
        fileN.save().then(e=>console.log(e));
        res.render('fileNegotiationForAdminDialog.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            access: fileN.access[req.params.login],
            agreement: fileN.agreement,
            dialog: fileN.account[req.params.login]
        });
    }
    catch(e){
        console.log(e)
        res.end('error')
    }
    }
    static async updatefile(req, res, next){
        try{
        if((req.file.contentType == 'application/pdf')||(req.file.contentType == 'text/plain')){
            let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
            delFile(fileN.file);
            fileN.file=req.file.filename
            fileN.comment=req.body.comment
            fileN.save();
            res.render('fileNegotiationForAdmin.html', {
                name: fileN.name,
                description: fileN.description,
                file: `/file/${fileN.file}`,
                account: fileN.account,
                agreement: fileN.agreement,
                response: 'Успешно'
            });
        }
        else
                {   
                    let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
                    if(req.file.filename) delFile(req.file.filename);
                    fileN.comment=req.body.comment;
                    fileN.save();
                    res.render('fileNegotiationForAdmin.html', {
                        name: fileN.name,
                        description: fileN.description,
                        file: `/file/${fileN.file}`,
                        account: fileN.account,
                        agreement: fileN.agreement,
                        response: 'Успешно'
                    });
                }
    }
    catch(e){
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
                    fileN.comment=req.body.comment;
                    fileN.save();
                    res.render('fileNegotiationForAdmin.html', {
                        name: fileN.name,
                        description: fileN.description,
                        file: `/file/${fileN.file}`,
                        account: fileN.account,
                        agreement: fileN.agreement,
                        response: 'Успешно'
                    });
    }
    }
}

router.get('/',Negotiation.show);
router.get('/name:name',Negotiation.getfile);
router.get('/name:name/:login',Negotiation.getSt);
router.post('/name:name/:login',Negotiation.dialog);
router.post('/name:name',upload.single('file'),Negotiation.updatefile);
router.get('/reg',Negotiation.getPage);
router.post('/reg',upload.single('file'),Negotiation.regfile)


module.exports.router = router;