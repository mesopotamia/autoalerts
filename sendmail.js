var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'auto.ad.alerts@gmail.com',
        pass: 'IloveDev22'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Auto Alerts', // sender address
    to: 'aziz.marwan@gmail.com', // list of receivers
    subject: 'Deals that may be of interest to you', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<h1>GMC Denali</h1><h2>Cant be beaten</h2>' // html body
};

// send mail with defined transport object
// transporter.sendMail(mailOptions, function(error, info){
//     if(error){
//         console.log(error);
//     }else{
//         console.log('Message sent: ' + info.response);
//     }
// });

module.exports = transporter;