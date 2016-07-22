var express = require('express');
var bodyParser = require('body-parser');
var url = require('url');
var app = express();
var morgan = require('morgan');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});


var port = process.env.PORT || 8080;

var router = express.Router();

router.get('/', function(req, res){
    res.json({ message: 'it works!' });
});

var apiRouter = require('./controllers/jobs.js');
var subscriptionRouter = require('./controllers/subscriptions.js')

app.use(router);
app.use('/api', apiRouter);
app.use('/api', subscriptionRouter);

process.on('uncaughtException', function(err) {
    console.log(err);
});

app.listen(port);
console.log('Using port ' + port);
