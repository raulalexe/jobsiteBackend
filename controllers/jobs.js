var express = require('express');
var parser = require('./../utils/regexParser.js');
var Job = require('../models/jobAd.js');
var api = express.Router();

function getAllJobs(res){
    Job.find({},
        function(err, jobs)
        {
            if(err) res.send(err);
            res.json(jobs);
        });
}

function getByKeywords(req, res){
    var regex = parser.getKeywordsRegex(req.query.keywords);
    Job.paginate( 
        { title: {$regex : regex} }
        , { select: 'title location company type logo',
            sort: {'postDate' : -1 },
            offset: req.query.skip*1,
            limit:  req.query.get*1 }
        , function(err, jobs){
            if(err) res.send(err);  
            res.json({jobs: jobs });
        });
} 

function getByLocation(req, res){
    var locRegex = parser.getLocationRegex(req.query.location);
    console.log(locRegex);
    Job.paginate( 
        { $or : [ { location: {$regex : locRegex} },
            { country: {$regex : locRegex } } ] 
        }
        , { select: 'title location company type logo',
            sort: {'postDate' : -1 },
            offset: req.query.skip*1,
            limit:  req.query.get*1 }
        , function(err, jobs){
            if(err) res.send(err);  
            res.json({jobs: jobs });
        });
}

function getWithoutKeywords(req, res){
    Job.paginate({},
        { select: 'title location company type logo',
            sort: {'postDate' : -1 },
            offset: req.query.skip*1,
            limit:  req.query.get*1 },
        function(err, jobs)
        {
            if(err) res.send(err);
            res.json({jobs: jobs });
        });
}

function getByKeywordsAndLocation(req, res){
    var regex = parser.getKeywordsRegex(req.query.keywords);
    var locRegex = parser.getLocationRegex(req.query.location);
    Job.paginate( { $and : [
        { title: {$regex : regex} },
        { $or : [ 
            { location: {$regex : locRegex} },
            { country: {$regex : locRegex } } ] }
        ] }
        , { select: 'title location company type logo',
            sort: {'postDate' : -1 },
            offset: req.query.skip*1,
            limit:  req.query.get*1 }
        , function(err, jobs){
            if(err) res.send(err);  
            res.json({jobs: jobs });
        });
}

module.exports = (function(){
    
    api.route('/jobs')
    
    .get(function(req, res){
        if(Object.keys(req.query).length === 0){
            getAllJobs(res);
        } 
        else{
            if(req.query.keywords == ''){
                if(req.query.location == ''){
                    getWithoutKeywords(req, res)
                }
                //if request has location parameter
                else{   
                    getByLocation(req, res);
                }
            }
            //if reuest has no location parameter
            if(req.query.location == ''){
                getByKeywords(req, res)
            }
            //if request has location parameter
            else{   
                getByKeywordsAndLocation(req, res);
            }
        }
    });
    
    api.route('/jobcount')
        .get(function(req,res){
            Job.count({}, function(err, data){
                if(err) res.send(err);
                console.log(data);
                res.json({count:data});
            })
        });
    
    api.route('/job/:id')
        .get(function(req, res){
            Job.findById(req.params.id, function(err, job){
               if(err) res.send(err);
               res.json(job);
            });
        });
    
    api.route('/jobs/countbylocation')
        .get(function(req, res){
            Job.aggregate([{
                $group: {
                    _id: '$country',
                    count: {$sum: 1}
                }
            }],
            function(err, data){
                if(err) res.send(err);
                res.json(data);
            });
        });

    api.route('/jobs/countbylanguage')
        .get(function(req, res){
            Job.aggregate([{
                $group: {
                    _id: '$language',
                    count: {$sum: 1}
                }
            }],
            function(err, data){
                if(err) res.send(err);
                res.json(data);
            });
        });

    api.route('/jobs/jobsCountryMonth')
        .get(function(req, res){
            var date = new Date(), y = date.getFullYear(), m = date.getMonth();
            var newD = new Date(y, m + 1, 0);
            var old = new Date(y, m - 1 , 1);
         
            Job.aggregate(
            {
                $match: {
                    'postDate': {$gte : old, $lte : newD}
                }
            },
            {
                $group: {
                    _id: {country: '$country', month: {$month: '$postDate'}},
                    count: {$sum: 1}
                }
            },
            {
                $project: {
                    _id:0,
                    country: "$_id.country",
                    month: "$_id.month",
                    count: "$count"
                }
            },
            function(err, data){
                if(err) res.send(err);
                res.json(data);
            });
        });

    return api;
})();
