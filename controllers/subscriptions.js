var express = require('express');
var Mailer = require('./email.js');


module.exports = (function(){
    var api = express.Router();
    
    var Subscription = require('../models/subscription.js');
    
    api.route('/subscriptions')
    	.post(function(req, res){
            if(req.body.email === undefined || req.body.email ==''){
                res.status(400).send("Bad request!");
            }
            Subscription.count({'email':req.body.email}, function(err, count){
                if(count == 0){
                    var subscription = new Subscription();
                    subscription.email = req.body.email;
                    subscription.save(function(err, data){
                        if(err) res.send(err);
                        var mailSender = new Mailer(subscription.email)
                        mailSender.sendMail(subscription.email);
                        console.log('Save subscriber: ' + subscription.email);
                        res.status(200).send("Subscribed successfully!");
                    });
                }
                else{
                    res.status(200).send("This email address was already subscribed!");
                }
            });
    	});

    api.route('/subscriptions')
        .get(function(req, res){
            Subscription.find({}, function(err, data){
                if(err) res.send(err);
                res.json(data);
            });
        });

    return api;
})();