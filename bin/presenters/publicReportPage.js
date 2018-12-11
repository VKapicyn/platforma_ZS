const express = require('express');
const router = express.Router();
const reportModel = require('../models/reportModel').reportModel;
const adminModel = require('../models/adminModel').adminModel;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage();
const delFile = require('../utils/uploader').Delete;
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

class PublicReport {
    static async getPage(req, res, next) {
        let reports =  await reportModel.find();
        if (req.session.admin){
            res.render('reportPage.html', {
                parametr: reports,
                admin: true
            });
        }
        else{
        res.render('reportPage.html', {
            parametr: reports
        });
        }
    }
    static newReport(req,res,next){
        try {
            // console.log(req.files.pdf.length);
            console.log(req.files.img[0].contentType);
            if ((req.files.pdf[0].contentType == 'application/pdf')&&((req.files.img[0].contentType== 'image/png')||(req.files.img[0].contentType== 'image/jpeg'))){
                
                let report = new reportModel({
                    name: req.body.name,
                    description: req.body.description,
                    creatingDate: new Date(),
                    pdfSrc: req.files.pdf[0].filename ,
                    pdfEngSrc:req.files.pdfEng[0].filename,
                    imgSrc: req.files.img[0].filename,
                    revards: req.body.revards,
                    standarts: req.body.standarts
                });
                report.save();
                res.redirect('/publicreport/id/'+report._id);
            }
            else
            {   
                delFile(req.files.pdf[0].filename);
                delFile(req.files.img[0].filename);
                delFile(req.files.pdfEng[0].filename);
                res.redirect('/');
            }
                
            
        } catch (e) {
        }
    }
    static async getPageByReportId(req,res,next){
        let report
        try{
            report =  await reportModel.findById(req.params.id);
        }
        catch(e) {report = e}
        res.render('reportPageItem.html', {
            parametr: report,
            download_url: `/file/${report.pdfSrc}`,
            downloadEng: `/file/${report.pdfEngSrc}`,
            img_url: `/file/${report.imgSrc}`
        });
    }

    static newReportGetPage(req,res,next){
        res.render('newReport.html', {
        });
    }
    static async updateReport(req,res,next){
        try{
            let report =  await reportModel.findById(req.params.id);
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
router.post('/new',adminModel.isAdminLogged,upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdfEng', maxCount: 1 }, { name: 'img', maxCount: 1 }]),PublicReport.newReport);
router.get('/new',adminModel.isAdminLogged,PublicReport.newReportGetPage);
router.get('/update/:id',adminModel.isAdminLogged,PublicReport.updateReportPage);
router.post('/update/:id',adminModel.isAdminLogged,upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdfEng', maxCount: 1 }, { name: 'img', maxCount: 1 }]),PublicReport.updateReport);
//  router.post('/createreport',PublicReport.createReport);
//adminModel.isAdminLogged,
module.exports.router = router;