var email = {
    service: 'QQ',
    user: '610091253@qq.com',
    pass: 'yqcmybpjdmvjbcci',
};

var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

smtpTransport = nodemailer.createTransport(smtpTransport({
    service: email.service,
    auth: {
        user: email.user,
        pass: email.pass,
    }
}));

var sendMail = function (recipient, type, subject, text, callback) {
    console.log(text);
    if (type == 'html'){
        smtpTransport.sendMail({
            from: email.user,
            to: recipient,
            subject: subject,
            html: text,
            encoding: 'utf-8',
        }, callback);
    }else {
        smtpTransport.sendMail({
            from: email.user,
            to: recipient,
            subject: subject,
            text: text,
            encoding: 'utf-8',
        }, callback);
    }
}

module.exports = sendMail;