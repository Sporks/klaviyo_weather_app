'use strict'
const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
    sendmail: true,
    newline: 'unix',
    path: '/usr/sbin/sendmail'
});

let emailer = {
  sendEmail: function(req, res, next){
    let mailOptions = {
        from: '"Klaviyo Weather ☀️️" <weather@klaviyo.com>', // sender address
        to: '', // list of receivers
        subject: '', // Subject line
        text: '', // plain text body
        html: '' // html body
    };
    let niceWeather = {Clear: 'Clear', Sunny: 'Sunny'};
    let badWeather = {Sleet: 'Sleeting', Rain: 'Raining', Snow: 'Snowing', Flurries: 'Flurrying', Tstorms: 'Storming'};
    res.users.forEach(user => {
      //Determine what kind of email to send, is it nice? rainy? neither?
      mailOptions.to = user.email;
      // In case it's sunny or more than 5F over average
      if (niceWeather[user.weather] || user.temp > 1*user.average + 5){
        mailOptions.subject = "It's nice out! Enjoy a discount on us.";
        mailOptions.html = `<h3> It's a nice day in ${user.city.replace(/\_/g, " ")}!  It's ${user.temp} degrees out and
                            ${niceWeather[user.conditions] || user.conditions}.`;
      // If it's bad weather
      } else if (badWeather[user.weather] || user.temp < 1*user.average -5 ) {
        mailOptions.subject = "Not so nice out? That's okay, enjoy a discount on us.";
        mailOptions.html = `<h3> It's not a great day in ${user.city} :(  It's ${user.temp} degrees out and
                            appears to be ${badWeather[user.conditions] || user.conditions}.`;
      // Neither of the above
      } else {
        mailOptions.subject = "Enjoy a discount on us.";
        mailOptions.html = `<h3> Here is the weather for ${user.city} It's ${user.temp} degrees out and
                            appears to be ${user.conditions}.`;
      }
      // Send the mail!
      transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message %s sent: %s', info.messageId, info.response);
      });
    });
    next();
  }
};

module.exports = emailer;
