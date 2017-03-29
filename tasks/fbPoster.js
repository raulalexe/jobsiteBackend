var FB = require('../modules/facebook');
var Job = require('../models/jobAd');
var sanitizeHtml = require('sanitize-html');
var parser = require('../utils/regexParser.js');
var FbApi = new FB();

//Arguments setup
var url = "http://findthejob4u.com/#!/job/"
var args = process.argv.slice(2);
var lang = args[0];
var location = args[1] == undefined ? '' : args[1];

var locRegex = parser.getLocationRegex(location);
var idx = 0;

Job.paginate({
    $and: [
        { language: lang },
        {
            $or: [
                { location: { $regex: locRegex } },
                { country: { $regex: locRegex } }
            ]
        }
    ]

}, {
    limit: 5,
    sort: '-postDate',
    select: 'title location country url description'
}, function(err, res) {
    if (err) console.log(err);
    var description = sanitizeHtml(res.docs[idx].description, { allowedTags: [] });
    var title = res.docs[idx].title.replace(/\b\w/g, function(l) { return l.toUpperCase() });
    var location = res.docs[idx].location + ", " + res.docs[idx].country;
    url = url + res.docs[idx]._id;
    title = title + " in " + res.docs[1].location
        //POST to facebook
    FbApi.PostToFb(title, description, url);
});


function getLocationRegex(loc) {
    loc = loc.replace(/^\s*|\s*$/g, '');
    if (loc.indexOf(',') != -1) {
        var regexStr = '';
        var locs = loc.split(",");
        for (var i = 0; i < locs.length; i++) {
            regexStr = i != 0 && i != locs.length - 1 ?
                regexStr + parseLocation(locs[i]) :
                regexStr + parseLocation(locs[i]) + '|';
        }
        return new RegExp(regexStr, 'ig');
    } else {
        return new RegExp(parseLocation(loc), 'ig');
    }
}

function parseLocation(loc) {
    loc = loc.toLowerCase();
    for (var key in cities) {
        if (key.toLowerCase() === loc || cities[key].indexOf(loc) != -1) {
            return key + "|" + cities[key].join("|");
        }
    }
    for (var key in countries) {
        if (key.toLowerCase() === loc || countries[key].indexOf(loc) != -1) {
            return key + "|" + countries[key].join("|");
        }
    }
    return loc;
}