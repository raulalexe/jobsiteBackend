var mongoose = require('mongoose');

//'mongodb://new:new@ds011492.mlab.com:11492/jobs1234';
var mongodbUri = 'mongodb://jobs:jobsNodeJs!@212.24.102.56:27017/jobs';

var db = mongoose.createConnection(mongodbUri);

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function callback() {
    console.info('Mongo db connected successfully');
});

module.exports = db;