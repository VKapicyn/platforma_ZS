const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

let config = require('./config.js'),
    url = config.deploy ? 'mongodb://localhost:27017/ZSDB' :
    `mongodb://${config.dbLogin}:${config.dbPass}@${config.dbAddress}:${config.dbPort}/${config.dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true });

app.use(
    express.static(__dirname + '/src'),
    bodyParser()
);

nunjucks.configure(__dirname + '/src/views', {
    autoescape: true,
    cache: false,
    express: app
});

//All Pages
app.use('/main', require('./bin/presenters/mainPage').router);

//Models (API)
app.use('/api/v1/user', require('./bin/models/userModel').router);

//Utils ???

/**
 * Для загрузки файлов рекомендую модуль 'multer'
 */

app.listen(require('./config.js').port);
console.log(`Running at Port ${config.port}`);

module.exports.mongoose = mongoose;