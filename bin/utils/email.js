const nodemailer = require('nodemailer');
let config = require('./../../config.js')

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: config.auth
});

exports.Send = (receiver, contentType, content) => {
    
    let mailOptions={};
        
    
    switch (contentType){
        case 1: //Registration
            // console.log(document.domain);
            mailOptions = {
                from: '"no-reply" <'+config.mail+'>', // sender address
                to: receiver.email, // list of receivers
                subject: 'Подтверждение регистрации', // Subject line
                text: 'Здраствуйте', // plain text body
                html: '<b>Здраствуйте '+ receiver.login +'<br> для подтверждения регистрации перейдите по ссылке <br><a href="'+config.locationOrigin+'/registrationstakeholder/conf/'+ content.key+'">'+ config.locationOrigin+'/registrationstakeholder/conf/'+ content.key +'</a></b>' // html body
            };
            break;
        case 2: // events invites
            mailOptions = {
                from: '"no-reply" <'+config.mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Вы были приглашены на новое мероприятие', // Subject line
                text: 'Здравствуйте', // plain text bbody
                html: '<b>Здраствуйте '+ receiver.login +'<br> Вы были приглашены на новое мероприятие, перейдите по ссылке для просмотра <br><a href="'+config.locationOrigin+'/events/id/'+ content.id+'">'+ config.locationOrigin+'/events/id/'+ content.id +'</a></b>' // html body
            };
            break;
        case 3: //survey new
            mailOptions = {
                from: '"no-reply" <'+config.mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Новый опрос ', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'.<br> Появился новый опрос '+ content.name+'</b>' // html body
            };
            break;
        case 4: //survey anotation
            mailOptions = {
                from: '"no-reply" <'+config.mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Добавлена аннотация к опросу', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'.<br> Обратите внимание на опрос '+ content.name+'</b>' // html body
            };
            break;
            case 5: //file agreement
            mailOptions = {
                from: '"no-reply" <'+config.mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Документ' + content.name +'был согласован', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'.<br> Документ' + content.name +'был согласован</b>' // html body
            };
            break;
            
        case 'feed':
            mailOptions = {
                from: '"feedback" <'+config.mail+'>', // sender address
                to: 'ZSplatformInfo@yandex.ru' ,  // list of receivers
                subject: 'Сообщение ', // Subject line
                text: 'Сообщение', // plain text body
                html: '<b>Вам пришло сообщение от '+content.name+'<br> '+content.content+'<br>Вы можете связаться с ним через '+content.email+'</b>' // html body
            };
            break;
            
    }
    

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });
}