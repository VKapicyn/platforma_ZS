let recaptcha = require('express-recaptcha');
recaptcha.init(require('../../config').public_key, require('../../config.js').private_key);

module.exports.recaptcha = recaptcha;