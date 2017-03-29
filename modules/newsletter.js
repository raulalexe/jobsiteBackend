var Job = require('../models/jobAd');
var Subscription = require('../models/subscription');
var TemplateParser = require('../modules/templateParser')
var Mailer = require('../controllers/email');
var async = require('async');

var newsletterDeliverer = function() {
    function getJobsForLangs(noOfAds, cb) {
        Job.distinct('language', function(err, langs) {
            async.map(langs, function(lang, done) {
                Job.paginate({ language: lang }, {
                    limit: noOfAds,
                    sort: '-postDate',
                    select: 'title url language company country location postDate'
                }, function(err, jobs) {
                    if (err) done(err);
                    done(null, jobs.docs);
                });
            }, function(err, jobArr) {
                if (err) cb(err);
                cb(null, jobArr);
            });
        });
    }

    function performSendNewsletter(jobsData) {
        var parser = new TemplateParser();
        var data = [].concat.apply([], jobsData);
        parser.renderTemplate("newsletter", { jobs: data }, function(template) {
            Subscription.paginate({}, { select: 'email -_id' }, function(err, emails) {
                var mailSender = new Mailer();
                async.map(emails.docs, function(emailData, done) {
                    console.log(emailData.email);
                    mailSender.sendMail(emailData.email, template.subject, template.html);
                    done(null, emailData);
                }, function(err, res) {
                    if (err) throw err;
                    //console.log("Emails sent to:");
                    //console.log(res);
                    setTimeout(function() {
                        console.log('exiting');
                        process.exit();
                    }, 10000);
                });
            });
        });
    }

    this.SendNewsletter = function() {
        async.waterfall([
            async.constant(2),
            getJobsForLangs,
        ], function(err, jobs) {
            if (err) throw err;
            performSendNewsletter(jobs);
        });
    }
}

module.exports = newsletterDeliverer;

//SendNewsletter({ jobs: [{ title: 'T', link: 'L', company: 'C', country: 'Countryy', location: 'LOC' }, { title: 'T', link: 'L', company: 'C', country: 'Countryy', location: 'LOC' }] });