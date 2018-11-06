const express = require('express');
const router = express.Router();
const reportModel = require('../models/reportModel').reportModel;
const adminModel = require('../models/adminModel').adminModel;
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

class PublicReport {
    static getPage(req, res, next) {
        res.render('mainPage.html', {
            parametr: 'Я страница публичных отчетов'
        });
    }
    static newReport(req,res,next){
        try {
            console.log(req.file);
            let report = new reportModel({
                'name': req.body.name,
                'description': req.body.description,
            });
            report.save();
        } catch (e) {
        }
        
        res.render('mainPage.html', );
    }
    static async getPageByReportId(req,res,next){
        let report
        try{
            report =  await reportModel.findById(req.params.id);
        }
        catch(e) {report = e}
        res.render('reportPage.html', {
            parametr: report,
            name: report.name,
        });
    }
    static newReportGetPage(req,res,next){
        res.render('newReport.html', {
        });
    }
    // static createReport(req,res,next){
    //     try {
    //         let report = new reportModel({
    //             'name': req.body.name,
    //             'description': req.body.description
    //         });
    //         report.save();
    //     } catch (e) {
    //     }
        
    //     res.render('main.html', );
    // }

}

//Роутинг внутри страницы
router.get('/', PublicReport.getPage);

 router.get('/id/:id',PublicReport.getPageByReportId);
router.post('/new',upload.single('pdf'),PublicReport.newReport);
router.get('/new',adminModel.isAdminLogged,PublicReport.newReportGetPage);
//  router.post('/createreport',PublicReport.createReport);
//
module.exports.router = router;