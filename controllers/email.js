var nodemailer = require('nodemailer');

var mailer = function() {
    var smtpConfig = {
        host: 'designanddevelopit.com',
        port: 25,
        secure: false, // use SSL
        auth: {
            user: 'contact',
            pass: 'TKDjuche45!'
        },
        tls: {
            rejectUnauthorized: false
        }
    };

    var transporter = nodemailer.createTransport(smtpConfig);

    this.sendMail = function(receiver, subjectLine, htmlContent) {
        if (!receiver || typeof(receiver) == 'undefined') return;
        if (!subjectLine || typeof(subjectLine) == 'undefined') return;
        if (!htmlContent || typeof(htmlContent) == 'undefined') return;

        var mailOptions = {
            from: '"Find the Job 4U" <contact@findthejob4u.com>', // sender address
            to: receiver, // list of receivers
        };

        var send = transporter.templateSender({ subject: subjectLine, html: htmlContent });
        send(mailOptions, function(err, info) {
            if (err) console.log(err);
            console.log("Message sent" + info.response);
        });
    }

    this.sendSubscriptionMail = function(receiver, userId) {
        var unsubscribeUrl = "http://www.findthejob4u.com/#/unsubscribe?uid=" + userId;
        var subject = 'Job Newsletter Subscription'; // Subject line
        var html = "<div><h1>Thank you for subscribing to our newsletter!<h1></div><div><b>Your subscription to the jobs weekly newsletter was successful!</b> From now on you will receive a weekly list of the newest jobs available on our site.</div><p>We hope this we will be useful for you and that you find your dream job using our website!</p> </br><div>In case you want to unsubscribe click here: <a href=" + unsubscribeUrl + ">unsubscribe</a></div>" // html body
        this.sendMail(receiver, subject, html);
    }
};

module.exports = mailer;