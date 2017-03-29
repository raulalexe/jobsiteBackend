var express = require('express');
var Mailer = require('./email.js');


module.exports = (function() {
    var api = express.Router();

    var Subscription = require('../models/subscription.js');

    api.route('/subscribe')
        .post(function(req, res) {
            if (req.body.email === undefined || req.body.email == '') {
                res.status(400).send("Bad request!");
            }
            Subscription.count({ 'email': req.body.email }, function(err, count) {
                if (count == 0) {
                    var subscription = new Subscription();
                    subscription.email = req.body.email;
                    subscription.save(function(err, data) {
                        if (err) res.send(err);
                        var mailSender = new Mailer(subscription.email, data._id)
                        mailSender.sendSubscriptionMail();
                        console.log('Save subscriber: ' + subscription.email);
                        res.status(200).send("Subscribed successfully!");
                    });
                } else {
                    res.status(200).send("This email address was already subscribed!");
                }
            });
        });

    api.route('/unsubscribe')
        .post(function(req, res) {
            if (req.body.uid === undefined || req.body.uid == '') {
                res.status(400).send();
            }
            var subscription = new Subscription();
            Subscription.remove({ _id: req.body.uid }, function(err, data) {
                if (err) res.send(err);
                res.status(200).send("You unsubscribed successfully.");
            });
        });

    api.route('/subscriptions')
        .get(function(req, res) {
            Subscription.find({}, function(err, data) {
                if (err) res.send(err);
                res.json(data);
            });
        });

    return api;
})();