const nodemailer = require('nodemailer');
const locationOrigin = 'http://localhost:3000';
const mail='goshanprodota@yandex.ru';
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: mail, 
        pass: 'goshan334' 
    }
});

exports.Send = (receiver, contentType, content) => {
    
    let mailOptions={};
        
    
    switch (contentType){
        case 1: //Registration
            // console.log(document.domain);
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email, // list of receivers
                subject: 'Подтверждение регистрации', // Subject line
                text: 'Здраствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'<br> для подтверждения регистрации перейдите по ссылке <br><a href="'+locationOrigin+'/registrationstakeholder/conf/'+ content.key+'">'+ locationOrigin+'/registrationstakeholder/conf/'+ content.key +'</a></b>' // html body
            };
            break;
        case 2: // events invites
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Вы были приглашены на новое мероприятие', // Subject line
                text: 'Здравствуйте', // plain text bbody
                html: '<b>Здравствуйте '+ receiver.login +'<br> Вы были приглашены на новое мероприятие, перейдите по ссылке для просмотра <br><a href="'+locationOrigin+'/events/id/'+ content.id+'">'+ locationOrigin+'/events/id/'+ content.id +'</a></b>' // html body
            };
            break;
        case 3: //survey new
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Новый опрос ', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'.<br> Появился новый опрос '+ content.name+'</b>' // html body
            };
            break;
        case 4: //survey anotation
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Добавлена аннотация к опросу', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здравствуйте '+ receiver.login +'.<br> Обратите внимание на опрос '+ content.name+'</b>' // html body
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