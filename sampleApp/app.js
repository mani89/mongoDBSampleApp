
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var forms = require('./forms').forms;
var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var formsapp= new forms('localhost', 27017);

//Routes

app.get('/', function(req, res){
  formsapp.findAll(function(error, frms){
      res.render('index', {
            title: 'All forms',
            formss:frms
        });
  });
});

app.get('/forms/new', function(req, res) {
    res.render('form_new', {
        title: 'New Form'
    });
});

//save new form
app.post('/forms/new', function(req, res){
    formsapp.save({
        title: req.param('title'),
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

app.listen(3000);
