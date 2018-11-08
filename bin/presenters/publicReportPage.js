const express = require('express');
const router = express.Router();
const reportModel = require('../models/reportModel').reportModel;
const adminModel = require('../models/adminModel').adminModel;
const multer  = require('multer');
const path  = require('path');
const newStorage = require('./../utils/uploader').newStorage;
const storage = newStorage('pdf','uploads')
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
            console.log(req.body);
            if (path.extname(req.file.originalname) == '.pdf'){
                console.log('done');
                let report = new reportModel({
                    'name': req.body.name,
                    'description': req.body.description,
                    'src': req.file.filename
                });
                report.save();
                // res.redirect('/publicreport');
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
        
        res.render('mainPage.html', );
    }
    static async getPageByReportId(req,res,next){
        let report
        try{
            report =  await reportModel.findById(req.params.id);
            // gfs.files.findOne({ _id: report.src }, (err, file) => {
            //     // Check if file
            //     if (!file || file.length === 0) {
            //       return res.status(404).json({
            //         err: 'No file exists'
            //       });
            //     }
            // });
        }
        catch(e) {report = e}
        res.render('reportPageItem.html', {
            parametr: report,
            name: report.name,
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
router.post('/new',upload.single('pdf'),PublicReport.newReport);
router.get('/new',adminModel.isAdminLogged,PublicReport.newReportGetPage);
//  router.post('/createreport',PublicReport.createReport);
//
module.exports.router = router;