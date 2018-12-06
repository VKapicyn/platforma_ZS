const express = require('express');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);
const app = express();

let config = require('./config.js'),
    url = config.deploy ? 'mongodb://localhost:27017/ZSDB' :
    `mongodb://${config.dbLogin}:${config.dbPass}@${config.dbAddress}:${config.dbPort}/${config.dbName}`;

mongoose.Promise = global.Promise;
mongoose.connect(url, { useNewUrlParser: true, useCreateIndex: true});
module.exports.mongoose = mongoose;

app.use(    
    session(
    ({
        secret: config.secret,
        resave: false,
        saveUninitialized: false,
        store: new mongoStore({ 
            url: url
        })
    })
));

app.use(bodyParser.json());
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
app.use('/registrationstakeholder', require('./bin/presenters/registrationstakeholder.js').router);
app.use('/feedback', require('./bin/presenters/feedbackPage').router);
app.use('/contacts', require('./bin/presenters/contactsPage').router);
app.use('/instruction', require('./bin/presenters/instructionPage').router);
app.use('/events', require('./bin/presenters/eventsPage').router);
app.use('/personsmap', require('./bin/presenters/personMapPage').router);
app.use('/lk', require('./bin/presenters/lkPage').router);
app.use('/lkadmin', require('./bin/presenters/lkAdminPage').router);
app.use('/publicquiz', require('./bin/presenters/publicQuizPage').router);
//app.use('/publicref', require('./bin/presenters/publicRefPage').router);
app.use('/loginstakeholder',require('./bin/presenters/logstakeholder.js').router)

app.use('/', require('./bin/presenters/toMain.js').router)

app.use('/registrationUser', require('./bin/presenters/registrationUser').router);
app.use('/loginUser', require('./bin/presenters/logUser').router)

app.use('/registrationstakeholder', require('./bin/presenters/registrationstakeholder.js').router);
app.use('/loginstakeholder',require('./bin/presenters/logstakeholder.js').router)

app.use('/createsurvey',require('./bin/models/adminModel.js').adminModel.isAdminLogged,require('./bin/presenters/createTemplateSurvey.js').router)
app.use('/survey',require('./bin/presenters/survey.js').router)
app.use('/publicreport', require('./bin/presenters/publicReportPage').router);
//app.use('/login',require('./bin/presenters/logPage').router);
app.use('/logadmin',require('./bin/presenters/logPageAdmin').router);

app.use('/fileNegotiation/admin',require('./bin/models/adminModel.js').adminModel.isAdminLogged,require('./bin/presenters/fileNegotiationAdmin.js').router);
app.use('/fileNegotiation/',require('./bin/presenters/fileNegotiation.js').router)

app.use('/search',require('./bin/presenters/search.js').router)

//Models (API)
app.use('/api/v1/user', require('./bin/models/userModel').router);

//Utils ???
app.use('/file/:filename', require('./bin/utils/uploader').getFile);

app.get('/registration', require('./bin/presenters/reg').getPage);

/**
 * Для загрузки файлов рекомендую модуль 'multer'
 */

app.listen(require('./config.js').port);
console.log(`Running at Port ${config.port}`);

