var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('./db.js');

var Schema = mongoose.Schema;

var jobSchema = new Schema({
    title: String,
    url: String,
    description: String,
    company: String,
    location: String,
    salaryMin: String,
    salaryMax: String,
    type: String,
    contractDuration: String,
    languages: String,
    postDate: Date,
    language: String,
    country: String
});

jobSchema.plugin(mongoosePaginate);

var JobAd = db.model('JobAd', jobSchema);

module.exports = JobAd;