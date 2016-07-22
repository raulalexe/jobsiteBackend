var cities = {
    'prague' : ['praga', 'prag', 'praha'],
    'bucharest' : ['bucuresti'],
    'munchen' : ['munich'],
    'dresen' : ['dresda', 'drezda']
};

var countries = {
    'germany' : ['deutschland', 'nemecko', 'alemania'],
    'czech republic' : ['cehia', 'republica ceha', 'ceska republika'],
    'ireland' : ['irlanda'],
    'uk' : ['anglia', 'gb', 'united kingdom'],
    'spain' : ['espana', 'spania', 'spanelsko', 'spanien'],
    'poland' : ['polonia'],
    'italy' : ['italia']
}

function escapeRegExpChars(text) {
    return text.replace(/[-[\]{}()*+?.\\^$|#]/g, "\\$&");
}

function getLocationRegex(loc){
    loc = loc.replace(/^\s*|\s*$/g, '');
    if(loc.indexOf(',') != -1){
        var regexStr = '';
        var locs = loc.split(",");
        for(var i=0; i < locs.length; i++){
            regexStr = i != 0 && i != locs.length - 1 
                ? regexStr + parseLocation(locs[i]) 
                : regexStr + parseLocation(locs[i]) + '|';
        }
        return new RegExp(regexStr, 'ig');
    }
    else{
        return new RegExp(parseLocation(loc), 'ig');
    }
}

function parseLocation(loc){
    loc = loc.toLowerCase();
    for (var key in cities){
        if(key.toLowerCase() === loc || cities[key].indexOf(loc) != -1) {
            return key + "|" + cities[key].join("|");
        }
    }
    for (var key in countries){
        if(key.toLowerCase() === loc || countries[key].indexOf(loc) != -1) {
            return key + "|" + countries[key].join("|");
        }
    }
    return loc;
}

function getKeywordsRegex(keywords){
    keywords = keywords.replace(/,$/,''); 
    return new RegExp(escapeRegExpChars(keywords).replace(/,\s*/g, '|'), 'ig');
}

module.exports = {
    getLocationRegex : getLocationRegex,
    getKeywordsRegex : getKeywordsRegex
};