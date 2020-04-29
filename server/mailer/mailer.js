var nodemailer = require('nodemailer');
var email = require('./../config/email');

var mailer = function () {
    var self = this;
    self.sendMail = function (to, message, subject) {
        var fromEmail = email.admin.email;
        var toEmail = to;
        var transporter = nodemailer.createTransport({
          host: 'smtp-mail.outlook.com',   //smtp.mailchannels.net
          secureConnection : false,
          port: 587,  //,25  
          tls: {
            ciphers:'SSLv3'
         },
            auth: {
              user: email.admin.email,
              pass: email.admin.password
            }
          });

        var mailOptions = {
            from: fromEmail,
            to: toEmail,
            subject: subject,
            // subject: "test email",

            // text: url,
            html: message
          };
        transporter.sendMail(mailOptions, function (error, response) {
            if (error) {
                console.log('Failed in sending mail : ', error);
            } else {
                console.log('Successful in sending email',response);
            }
        });
    }
};

module.exports = mailer;