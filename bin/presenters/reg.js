const Recaptcha = require('recaptcha').Recaptcha;

let PUBLIC_KEY  = require('../../config').public_key,
    PRIVATE_KEY = require('../../config').private_key,
    recaptcha = new Recaptcha(PUBLIC_KEY, PRIVATE_KEY);
    
exports.getPage = (req, res) =>{
    res.render('registration.html', {
        captcha: recaptcha.toHTML()
    })
}