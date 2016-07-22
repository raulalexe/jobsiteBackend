var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');
var db = require('./db.js');

var Schema = mongoose.Schema;

var subscriptionSchema = new Schema ({
	    email: String,
	}, 
	{ collection: 'subscriptions'});

subscriptionSchema.plugin(mongoosePaginate);

var Subscription = db.model('Subscription', subscriptionSchema);

module.exports = Subscription;

