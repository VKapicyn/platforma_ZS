const nodemailer = require('nodemailer');
const locationOrigin = 'http://localhost:3000';
const mail='info@i-fastrepair.ru';
const ourmail=''
// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
        user: mail, 
        pass: 'asdf12345' 
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
                html: '<b>Здраствуйте '+ receiver.login +'<br> для подтверждения регистрации перейдите по ссылке <br><a href="'+locationOrigin+'/registrationstakeholder/conf/'+ content.key+'">'+ locationOrigin+'/registrationstakeholder/conf/'+ content.key +'</a></b>' // html body
            };
            break;
        case 2: // events invites
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Вы были приглашены на новое мероприятие', // Subject line
                text: 'Здравствуйте', // plain text bbody
                html: '<b>Здраствуйте '+ receiver.login +'<br> Вы были приглашены на новое мероприятие, перейдите по ссылке для просмотра <br><a href="'+locationOrigin+'/events/id/'+ content.id+'">'+ locationOrigin+'/events/id/'+ content.id +'</a></b>' // html body
            };
            break;
        case 3: //survey new
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Новый опрос ', // Subject line
                text: 'Здравствуйте', // plain text body
                html: '<b>Здраствуйте '+ receiver.login +'<br> Появился новый опрос'+ content.name+', перейдите по ссылке для просмотра </b>' // html body
            };
            break;
        case 4: //survey anotation
            mailOptions = {
                from: '"no-reply" <'+mail+'>', // sender address
                to: receiver.email,  // list of receivers
                subject: 'Hello ', // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>Hello world?</b>' // html body
            };
            break;
        case 'feed':
            mailOptions = {
                from: '"feedback" <'+mail+'>', // sender address
                to: ourmail ,  // list of receivers
                subject: 'Сообщение ', // Subject line
                text: 'Сообщение', // plain text body
                html: '<b>Вам пришло сообщение от '+content.name+'<br> '+content.content+'<br>Вы можете связаться с ним через '+content.email+'</b>' // html body
            };

            
    }
    

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });
}