var request = require('request');
var async = require('async');
var Job = require('../models/jobAd.js');

Job.find({},
    function(err, jobs) {
        if (err) console.log(err);
        async.each(jobs.docs, function(job, callback) {
            delAdIfNotLive(job, callback);
        }, function(err) {
            if (err) {
                console.log('An ad failed to process');
            } else {
                console.log('All ads have been processed successfully');
            }
            process.exit();
        });
    });


/* TEST WITH PAGINATED DATA FOR FASTER RESULT
Job.paginate({}, {
    limit: 5
}, function(err, jobs) {
    if (err) console.log(err);
    async.each(jobs.docs, function(job, callback) {
        delAdIfNotLive(job, callback);
    }, function(err) {
        if (err) {
            console.log('An ad failed to process');
        } else {
            console.log('All ads have been processed successfully');
        }
        process.exit();
    });
});
*/

var delAdIfNotLive = function(job, cb) {
    request(job.url, function(err, res, body) {
        console.log(res.statusCode);
        if (res.statusCode == 404) {
            deleteInvalidAd(job.url, cb);
        } else {
            cb();
        }
    });
}

var deleteInvalidAd = function(url, cb) {
    console.log("Ad to delete: " + url);
    Job.remove({ 'url': url }, function(err) {
        console.log(err);
        cb();
    });
}