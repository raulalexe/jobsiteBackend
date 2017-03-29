var Twitter = require('../modules/twitter');
var Job = require('../models/jobAd');
var parser = require('../utils/regexParser.js');

var accessToken = '835228159528288260-g0CvOreltzHNfSwYXVjXDh3cERFYDmD';
var accessTokenSecret = 'gMR8DCbEbCqUsGhZVNJPmxNMmLfWgI1lLefbgGTmg0e0P';
var consumerKey = '2HKEpIJSn3CMjSV5wl2B4GLd8';
var consumerSecret = 'yxKhHUomIhSQMSsj9SiVpu9PJbnyW9nq9PgilBGOkhKeqPfHdv';

var twitterApi = new Twitter(consumerKey, consumerSecret, accessToken, accessTokenSecret);

var urlRoot = "http://findthejob4u.com/#!/job/"
var lang = 'English';
var defaultShortHashTags = "";
var defaultHashTags = "#jobs #career #jobad #jobsearch";

//Arguments processing
var args = process.argv.slice(2);
var lang = args[0];
var location = args[1] == undefined ? '' : args[1];
var locRegex = parser.getLocationRegex(location);
var idx = 0

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
    select: 'title url location country company'
}, function(err, res) {
    if (err) console.log(err);
    var title = res.docs[idx].title.replace(/\b\w/g, function(l) { return l.toUpperCase() });
    var url = urlRoot + res.docs[idx]._id;
    var location = res.docs[idx].location != "undefined" && res.docs[idx].location != '' ? res.docs[idx].location.trim() : '';
    location = location.replace(/\b\w/g, function(l) { return l.toUpperCase() });
    var country = res.docs[idx].country != "undefined" && res.docs[idx].country != '' ? res.docs[idx].country.trim() : '';
    country = country.replace(/\b\w/g, function(l) { return l.toUpperCase() });
    var msg = title;

    if (encodeURIComponent(msg).length + encodeURIComponent(defaultHashTags).length <= 140) {
        msg += "\n" + defaultHashTags;
    } else {
        msg += "\n" + defaultShortHashTags;
    }

    if (location != '') msg += ' in #' + location.replace(/\s+/g, '');
    if (country != '') msg += ', #' + country.replace(/\s+/g, '');
    msg += "\n" + url;

    //console.log(msg);
    twitterApi.Tweet(msg, true);
});

//UTILITY FUNCTIONS
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