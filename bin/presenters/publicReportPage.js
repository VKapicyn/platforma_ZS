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

class PublicReport {
    static async getPage(req, res, next) {
        let reports =  await reportModel.find();
        console.log(reports);
        res.render('reportPage.html', {
            parametr: reports
        });
        
    }
    static newReport(req,res,next){
        try {
            console.log(req.body.name);
            if (path.extname(req.file.originalname) == '.pdf'){
                console.log('done');
                let report = new reportModel({
                    'name': req.body.name,
                    'description': req.body.description,
                    'src': req.file.filename
                });
                report.save();
                res.redirect('/publicreport/id/'+report._id);
            }
            else
            {   console.log('wrong');
                gfs.remove({ _id: req.params.id, root: 'uploads' }, (err, gridStore) => {
                    if (err) {
                      return res.status(404).json({ err: err });
                    }
                
                    res.redirect('/');
                });
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
            name: report.name,
            download_url: `/file/${report.src}`
        });
    }

    static newReportGetPage(req,res,next){
        res.render('newReport.html', {
        });
    }
    static async updateReport(req,res,next){
        try{
            if (path.extname(req.file.originalname) == '.pdf'){
            let report =  await reportModel.findById(req.params.id);
            delFile(report.src);
            report.src=req.file.filename;
            report.description=req.body.description;
            report.save();
            res.redirect('/publicreport/id/'+report._id);
        }
        else{
            delFile(req.file.filename);
                    res.end('error')
        }
        }
        catch(e){
            console.log(e)
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
router.post('/new',upload.single('pdf'),PublicReport.newReport);
router.get('/new',PublicReport.newReportGetPage);
router.get('/update/:id',PublicReport.updateReportPage);
router.post('/update/:id',upload.single('pdf'),PublicReport.updateReport);
//  router.post('/createreport',PublicReport.createReport);
//
module.exports.router = router;