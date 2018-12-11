const express = require('express');
const router = express.Router();


class About {
    static async getPage(req, res, next) {
        res.render('about.html', {
        });
    }
}

//Роутинг внутри страницы
router.get('/', About.getPage);



module.exports.router = router;