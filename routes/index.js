var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index-one-page.html');
});

/* Post contact email */
router.post('/contact-email', function(req, res) {
  var nodemailer = require('nodemailer');
  var smtpTransport = require('nodemailer/node_modules/nodemailer-smtp-transport');

  // create reusable transporter object using SMTP transport/ TCT: Using SMPT transporter
  var transporter = nodemailer.createTransport(smtpTransport({
      host: 'smtp.ipage.com',
      port: 587,
      ignoreTLS: true,
      auth: {
          user: 'no-reply@tcit.cl',
          pass: 'Gransayaman1'
      }
  }));

  // NB! No need to recreate the transporter object. You can use
  // the same transporter object for all e-mails

  // setup e-mail data with unicode symbols
  var mailOptions = {
      from: req.body.name+' <'+req.body.email+'>', // sender address
      to: 'contact@tcit.cl', // list of receivers
      subject: req.body.subject, // Subject line
      text: req.body.body, // plaintext body
      html: '<b>'+req.body.message+'</b>' // html body
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function(error, info){
      if(error){
          console.log(error);
          res.writeHead(505, {'Content-Type': 'text/plain' });
          res.write(error);
      }else{
          console.log('Message sent: ' + info.response);
          res.writeHead(200, {'Content-Type': 'text/plain' });
          res.write(info.response);
          res.end();
      }
  });
});

/* GET site map. */
router.get('/sitemap', function(req, res) {
  res.render('sitemap.xml');
});

/* GET site map. */
router.get('/.well-known/acme-challenge/2QScncqgUFf1d_M0ydXuIe8tyXrvIS48l2N6Uf7lDBc', function(req, res) {
  res.send('2QScncqgUFf1d_M0ydXuIe8tyXrvIS48l2N6Uf7lDBc.JUwO1wN4w_UaFzNZeFNat-VuZKo028zgvQEAxChE36k');
});

module.exports = router;
