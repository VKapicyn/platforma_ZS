const express = require('express');
const router = express.Router();
const reportModel = require('../models/reportModel').reportModel;
const adminModel = require('../models/adminModel').adminModel;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage();
const delFile = require('../utils/uploader').Delete;
const shModel = require('../models/stakeholderModel').stakeholderModel;
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

class PublicReport {
    static async getPage(req, res, next) {
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        let reports =  await reportModel.find().sort({creatingDate:1});
        reports.forEach(i => {
            if (i.creatingDate)
            i.date = i.creatingDate.toLocaleString("ru", {day: 'numeric'})+ '.' + i.creatingDate.toLocaleString("ru", {month: 'numeric'}) + '.' + i.creatingDate.toLocaleString("ru", {year: 'numeric'});
        });
        if (req.session.admin){
            res.render('reportPage.html', {
                parametr: reports,
                admin: true
            });
        }
        else{
        res.render('reportPage.html', {
            parametr: reports,
            sh:sh
        });
        }
    }
    static newReport(req,res,next){
        try {
            // console.log(req.files.pdf.length);
            let img = 'nophoto';
            let pdfrus = 'nofile';
            let pdfeng = 'nofile';
            let rusSmall = 'nofile';
            let engSmall = 'nofile';
            if (req.files){ 
                
            
            // if ((req.files.pdf[0].contentType != 'application/pdf')&&((req.files.img[0].contentType != 'image/png')||(req.files.img[0].contentType != 'image/jpeg'))){
                 
            //         delFile(req.files.pdf[0].filename);
            //         delFile(req.files.img[0].filename);
            //         delFile(req.files.pdfEng[0].filename);
            //         res.redirect('/');
            // }
            // else{
                req.files.img? img = req.files.img[0].filename:img= img
                req.files.pdfEng? pdfeng = req.files.pdfEng[0].filename:pdfeng= pdfeng;
                req.files.pdf? pdfrus = req.files.pdf[0].filename: pdfrus=pdfrus;
                req.files.rusSmall? rusSmall = req.files.rusSmall[0].filename: rusSmall=rusSmall;
                req.files.engSmall? engSmall = req.files.engSmall[0].filename: engSmall=engSmall;
            // }
            }
                let report = new reportModel({
                    name: req.body.name,
                    description: req.body.description,
                    creatingDate: new Date(),
                    pdfSrc: pdfrus ,
                    pdfEngSrc:pdfeng,
                    imgSrc: img,
                    revards: req.body.revards,
                    standarts: req.body.standarts,
                    rusSmall:rusSmall,
                    engSmall:engSmall
                });
                report.save();
                res.redirect('/publicreport/id/'+report._id);
           
            
        
                
            
        } catch (e) {
        }
    }
    static async getPageByReportId(req,res,next){
        let report;
        let sh = (req.session.stakeholder) ? await shModel.findOne({login:req.session.stakeholder.login}) : undefined;
        try{
            
            report =  await reportModel.findById(req.params.id);
        }
        catch(e) {report = e}
        res.render('reportPageItem.html', {
            report: report,
            download_url: `/file/${report.pdfSrc}`,
            rus_small:`/file/${report.rusSmall}`,
            eng_small:`/file/${report.engSmall}`,
            downloadEng: `/file/${report.pdfEngSrc}`,
            img_url: `/file/${report.imgSrc}`,
            sh:sh
        });
    }

    static newReportGetPage(req,res,next){
        res.render('newReport.html', {
        });
    }
    static async updateReport(req,res,next){
        try{
            let report =  await reportModel.findById(req.params.id);
            if (req.files){
            if(req.files.pdf && req.files.pdf[0].contentType == 'application/pdf'){
                delFile(report.pdfSrc);
                report.pdfSrc = req.files.pdf[0].filename;
            }
            if(req.files.pdfEng && req.files.pdfEng[0].contentType == 'application/pdf'){
                delFile(report.pdfEngSrc);
                report.pdfEngSrc = req.files.pdfEng[0].filename;
            }
            if(req.files.img && req.files.img[0].contentType == 'image/png'){
                delFile(report.imgSrc);
                report.imgSrc = req.files.img[0].filename;
            }
            }
            if(req.body.description) report.description=req.body.description;
            if(req.body.revards) report.revards=req.body.revards;
            if(req.body.standarts) report.standarts=req.body.standarts;
            report.save();
            res.redirect('/publicreport/id/'+report._id);
        }
        catch(e){
            console.log(e);
            res.end('error')
        }
    }
    static async updateReportPage(req,res,next){
        try{
        let report =  await reportModel.findById(req.params.id);
        res.render('reportPageupdate.html', {
            name: report.name
        });
        }
        catch(e){
            res.end('error');
            console.log(e)
        }
    }

}

//Роутинг внутри страницы
router.get('/', PublicReport.getPage);

router.get('/id/:id',PublicReport.getPageByReportId);
router.post('/new',adminModel.isAdminLogged,upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdfEng', maxCount: 1 }, { name: 'engSmall', maxCount: 1 } ,{ name: 'rusSmall', maxCount: 1 }, { name: 'img', maxCount: 1 }]),PublicReport.newReport);
router.get('/new',adminModel.isAdminLogged,PublicReport.newReportGetPage);
router.get('/update/:id',adminModel.isAdminLogged,PublicReport.updateReportPage);
router.post('/update/:id',adminModel.isAdminLogged,upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdfEng', maxCount: 1 },{ name: 'img', maxCount: 1 }]),PublicReport.updateReport);
//  router.post('/createreport',PublicReport.createReport);
//adminModel.isAdminLogged,
module.exports.router = router;