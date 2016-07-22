var nodemailer = require('nodemailer');

var mailer = function(receiver){
	var smtpConfig = {
		host: 'mail.designanddevelopit.com',
	    port: 25,
	    secure: false, // use SSL
	    auth: {
	        user: 'contact@designanddevelopit.com',
	        pass: 'TKDjuche45!'
	    }
	};

	var mailOptions = {
		from: 'postmaster@designanddevelopit.com', // sender address
	    to: receiver, // list of receivers
	    subject: 'Job Newsletter Subscription', // Subject line
	    text: 'Your subscription was successful!', // plaintext body
	    html: '<b>Your subscription was successful!</b>' // html body
	};

	var transporter = nodemailer.createTransport(smtpConfig);

	this.sendMail = function(){
		console.log('sen mail');
		transporter.sendMail(mailOptions, function(err, info){
			if(err){
				return console.log(err);
			}
			console.log("Message sent" + info.response);
		});
	}
};

module.exports = mailer;