const express = require('express');
const router = express.Router();
const fileNegotiationModel = require('../models/fileNegotiationModel').fileNegotiationModel;
const stakeholderModel = require('../models/stakeholderModel').stakeholderModel;
const delFile = require('../utils/uploader').Delete;
const multer  = require('multer');
const newStorage = require('../utils/uploader').newStorage;
const storage = newStorage()
const upload = multer({ storage });
const Json2csvParser = require ( 'json2csv' ) . Parser ;

class Negotiation{
    static async getPage(req, res, next){
        let stakeholders = await stakeholderModel.find()
        res.render('regFileNegotiationForAdmin.html',{
            stakeholders:stakeholders
        })
    }
    static async csv(req, res, next){
    let neg = await fileNegotiationModel.findOne({'_id': req.params.id});
    console.log(neg);
    let stakeholders;
    console.log(Array.isArray(neg.access));
    let arr=[];
    neg.access.forEach(i => {
        arr.push( {login: i})
    });
    if (Array.isArray(neg.access)){
     stakeholders = await stakeholderModel.find({$or: arr });
    }
    else 
    stakeholders = await stakeholderModel.find({login: neg.access });
    console.log(stakeholders);
    let sh={};
    let stake=[];
    sh.comments =[];
    neg.account.forEach(i => {
        let j =0;
        stakeholders.forEach(item =>{
            if (i.sender == item.login){
                
                sh.comments.push({text:i.text});
            
            sh.name = item.lastname +' ' + item.firstname +' ' +item.patronymic;
            sh.organization = item.organization;
            stake[j] = sh
            }
        });
        j++;
        
    });
    

   let fields = [{
            label:'ФИО',
            value: 'name'
        },
        {
            label:'организация',
            value: 'organization'
        },
        {
            label:'комментарии',
            value:'comments.text'
        }];
        let json2csvParser = new Json2csvParser ( {  fields , unwind: ['comments'], unwindBlank: true} ) ;    
                const csv = json2csvParser.parse( stake ) ; 
                res.set('Content-Type', 'application/octet-stream');
                res.attachment(neg.name+'.csv');
                res.status(200).send(csv); 
                // res.redirect('/lkadmin');
    }

    static async regfile(req, res, next){
        try{
            if((req.file.contentType == 'application/pdf')||(req.file.contentType == 'text/plain')){
                let mas = [];
                if(Array.isArray(req.body.access)){mas = [...mas,...req.body.access]}
                else {mas.push(req.body.access)}
                let file = new fileNegotiationModel({
                    name: req.body.name,
                    description: req.body.description,
                    file: req.file.filename,
                    access: req.body.access,
                    firstDate: req.body.firstDate,
                    lastDate: req.body.lastDate
                });
                file.save();
                let stakeholders = await stakeholderModel.find()
                // res.render('regFileNegotiationForAdmin.html',{
                //     stakeholders:stakeholders,
                //     response:"Успешно"
                // })
                res.redirect('/lkadmin');
            }
            else
                {   
                    delFile(req.file.filename);
                    res.end('error')
                }
            }
            catch(e){
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
        if(fileN.agreement){
            for(let i=0;i<fileN.agreement.length;i++){
                fileN.agreement[i].data=(new Date(fileN.agreement[i].data)).toString()
            }
        }
        res.render('fileNegotiationForAdmin.html', {
            name: fileN.name,
            id:fileN._id,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            access: fileN.access,
            agreement: fileN.agreement,
            firstDate: fileN.firstDate.toLocaleString("ru", {day: 'numeric'}) + '.' + fileN.firstDate.toLocaleString("ru", {month: 'numeric'}) + '.' + fileN.firstDate.toLocaleString("ru", {year: 'numeric'}),
            lastDate: fileN.lastDate.toLocaleString("ru", {day: 'numeric'}) + '.' + fileN.lastDate.toLocaleString("ru", {month: 'numeric'}) + '.' + fileN.lastDate.toLocaleString("ru", {year: 'numeric'}),
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
            firstDate: fileN.firstDate.toLocaleString("ru", {day: 'numeric'}) + '.' + fileN.firstDate.toLocaleString("ru", {month: 'numeric'}) + '.' + fileN.firstDate.toLocaleString("ru", {year: 'numeric'}),
            lastDate: fileN.lastDate.toLocaleString("ru", {day: 'numeric'}) + '.' + fileN.lastDate.toLocaleString("ru", {month: 'numeric'}) + '.' + fileN.lastDate.toLocaleString("ru", {year: 'numeric'}),
            dialog: fileN.account.filter(item=>{if(item.user == req.params.login || item.sender == req.params.login) return true})
        });
    }
    catch(e){
        res.end('error')
    }
    }
    static async dialog(req, res, next){
        try{
        let fileN =  await fileNegotiationModel.findOne({name:req.params.name});
        let obj={user: req.params.login, date: Date.now().toString(), sender: 'admin', text: req.body.dialog};
        
        fileN.account=[...fileN.account,obj];
        
        await fileN.save();
        res.render('fileNegotiationForAdminDialog.html', {
            name: fileN.name,
            description: fileN.description,
            file: `/file/${fileN.file}`,
            firstDate: fileN.firstDate,
            lastDate: fileN.lastDate,
            dialog: fileN.account.filter(item=>{if(item.user == req.params.login || item.sender == req.params.login) return true})
        });
        
    }
    catch(e){
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
                firstDate: fileN.firstDate,
                lastDate: fileN.lastDate,
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
                        firstDate: fileN.firstDate,
                        lastDate: fileN.lastDate,
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
                        firstDate: fileN.firstDate,
                        lastDate: fileN.lastDate,
                        response: 'Успешно'
                    });
    }
    }
    static back2(req,res,next){
        res.redirect('/lkadmin')
    }
}

router.get('/',Negotiation.show);
router.get('/id:id/csv',Negotiation.csv);
router.get('/name:name',Negotiation.getfile);
router.post('/name:name/back',Negotiation.back2);
router.get('/name:name/:login',Negotiation.getSt);
router.post('/name:name/:login',Negotiation.dialog);
router.post('/name:name',upload.single('file'),Negotiation.updatefile);
router.get('/reg',Negotiation.getPage);
router.post('/reg',upload.single('file'),Negotiation.regfile)


module.exports.router = router;