var http = require('http')
  , url = require('url')
  , express = require('express')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , utils = require('./utils')
  , natural = require('natural')
  , uuid = require('node-uuid')
;
var L = utils.L;

var app = express.createServer();
app.configure(function(){
   //app.use(express.methodOverride());
   app.use(express.bodyParser());
  app.use(express.static(__dirname + '/static'));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


// -----------------------------------------------------------------------------
//


var classifiers = {};

function trainer(key, text, user) {
  if (!user)
    user = uuid();
  classifier = classifiers[user];
  if (!classifier)
    classifiers[user] = new natural.BayesClassifier();
  classifiers[user].train([{
    classification: key,
    text: text
  }]);
  var save_file = 'saved_classifiers/' + user + '.json';
  classifiers[user].save(save_file, function(err, cls) {
    L(err);
  });
  return user;
}

app.post('/train/key/:key/user/:user', function(req, res){
  var text = req.body.text;
  var user = trainer(req.params.key, text, req.params.user);
  res.send(user);
})

app.post('/train/key/:key', function(req, res){
  var text = req.body.text;
  var user = trainer(req.params.key, text);
  res.send(user);
})

app.post('/guess/user/:user', function (req, res) {
  var text = req.body.text;
  var classifier = classifiers[req.params.user];
  if (!classifier) {
    res.send('Error - not recognized user');
  } else {
    var key = classifier.classify(text);
    res.send(key);
  }
});


// -----------------------------------------------------------------------------
//

app.get('/test.html', function (req, res) {
  var user = '';
  var key = '';
  res.render('test.jade', {
     layout: false,
      user: user,
      key: key
  });
});


app.listen(8000);
L("Server started on :8000");
