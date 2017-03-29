var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

var templateParser = function() {
    this.renderTemplate = function(templateDirName, locals, cb) {
        var templateDir = path.join(__dirname, "../templates", templateDirName);
        var template = new EmailTemplate(templateDir);
        template.render(locals, function(err, result) {
            if (err) throw err;
            cb(result);
        });
    };
};

module.exports = templateParser;
/*
var tp = new templateParser();
tp.renderTemplate("newsletter", { jobs: [{ title: 'T', link: 'L', company: 'C', country: 'Countryy', location: 'LOC' }, { title: 'T', link: 'L', company: 'C', country: 'Countryy', location: 'LOC' }] }, function(res) {
    console.log(res);
});*/