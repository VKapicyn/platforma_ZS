const express = require('express');
const router = express.Router();
const reportModel = require('../models/reportModel').reportModel;
const adminModel = require('../models/adminModel').adminModel;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const delFile = require('./../utils/uploader').Delete;
const storage = newStorage();
const PDFImage = require("pdf-image").PDFImage;
const upload = multer({ storage });
// const upload = multer({ dest: 'uploads/' });

class PublicReport {
    static async getPage(req, res, next) {
        let reports =  await reportModel.find();
        console.log(reports);
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
            if ((req.files.pdf[0].contentType == 'application/pdf')&&((req.files.img[0].contentType== 'image/png')||(req.files.img[0].contentType== 'image/png'))){
                
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

}

//Роутинг внутри страницы
router.get('/', PublicReport.getPage);

router.get('/id/:id',PublicReport.getPageByReportId);
router.post('/new',upload.fields([{ name: 'pdf', maxCount: 1 }, { name: 'pdfEng', maxCount: 1 }, { name: 'img', maxCount: 1 }]),PublicReport.newReport);
router.get('/new',adminModel.isAdminLogged,PublicReport.newReportGetPage);
//  router.post('/createreport',PublicReport.createReport);
//
module.exports.router = router;