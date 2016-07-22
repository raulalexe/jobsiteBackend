var mongoose = require('mongoose');

var mongodbUri = '';

var db = mongoose.createConnection(mongodbUri);

db.on('error', console.error.bind(console, 'connection error:')); 

db.once('open', function callback () {
  console.info('Mongo db connected successfully');
});

module.exports = db;
