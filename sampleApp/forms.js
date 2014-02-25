var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

forms = function(host,port) {
	this.db= new Db('node-mongo-formsapp', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
	this.db.open(function(){});
};

forms.prototype.getCollection = function(callback){
	this.db.collection('forms', function(error, forms_collection) {
      	if( error ) callback(error);
      	else callback(null, forms_collection);
    	});
};


//get all forms
forms.prototype.findAll = function(callback) {
    this.getCollection(function(error, forms_collection) {
      if( error ) callback(error)
      else {
        forms_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new form
forms.prototype.save = function(thisform, callback) {
    this.getCollection(function(error, forms_collection) {
      if( error ) callback(error)
      else {
        if( typeof(thisform.length)=="undefined")
          thisform = [thisform];

        for( var i =0;i< thisform.length;i++ ) {
          thisform = thisform[i];
          thisform.created_at = new Date();
        }

        forms_collection.insert(thisform, function() {
          callback(null, thisform);
        });
      }
    });
};

exports.forms = forms;
