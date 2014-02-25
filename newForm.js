var bogart = require('bogart');
var mongoose = require('mongoose');
var Q = require('promised-io/promise');

var formSchema = new mongoose.Schema({
  formName: String,
  description: String,
  postedAt : String,
  items : [ itemsSchema ]
});

var itemsSchema = new mongoose.Schema({
  question: String,
  answer: String
});
  
 
var Form  = mongoose.model('formsSchema', formSchema);

var app = bogart.router(function(get, post, put, destroy) {
 
  var client     = mongoose.connect('mongodb://localhost/formsapp');
  var viewEngine = bogart.viewEngine('mustache');
 
  get('/forms', function(req) {
    return Q.execute(Form.find.bind(Form)).then(function(docs) {
      return viewEngine.respond('forms.html', {
        locals: {
          posts: docs,
          title: 'Forms Home'
        }
      })
    });
  });


 get('/forms/new', function(req) {
    return viewEngine.respond('newForm.html', {
      locals: {
        title: 'New Form'
      }
    });
  });

post('/forms', function(req) {
    var form = new Form(req.params);
    
    return Q.execute(form.save.bind(form)).then(function() {
      return bogart.redirect('/forms');
    });
  });

get('/forms/:id', function(req) {
    console.log('retrieving form');
 
    return Q.execute(Form.findById.bind(Form), req.params.id).then(function(form) {
      return viewEngine.respond('thisForm.html', { locals: form });
    });
  });

});

app= bogart.middleware.parseForm(app);

bogart.start(app);

