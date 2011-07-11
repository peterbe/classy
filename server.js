require.paths.unshift('vendor/natural/lib');

var http = require('http')
  , url = require('url')
  , express = require('express')
  , sys = require(process.binding('natives').util ? 'util' : 'sys')
  , utils = require('./utils')
  , natural = require('natural')
  , uuid = require('node-uuid')
  , redis = require('redis')
;
var L = utils.L;

var BayesClassifier = natural.BayesClassifier.BayesClassifier;
var functionify = natural.BayesClassifier.functionify;

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
  var r = redis.createClient();
  if (!user)
    user = uuid();
  classifier = classifiers[user];
  if (!classifier) {
    r.stream.on('connect', function() {
      r.get('stream:' + user, function (err, data) {
        classifier = new BayesClassifier();
        data = JSON.parse(data);
        if (data) {
          BayesClassifier.load(data, function(err, classifier) {
            classifier.train([{
              classification: key,
              text: text
            }]);
            _save_classifier(r, user, classifier);
          });
        } else {
          classifier.train([{
            classification: key,
            text: text
          }]);
          _save_classifier(r, user, classifier);
        }
      });
    });
  } else {
    classifier.train([{
      classification: key,
      text: text
    }]);
    _save_classifier(r, user, classifier);
  }
  return user;
}
var assert = require('assert');

BayesClassifier.load = function(data, callback, stemmer) {
  functionify(data, stemmer);
  if (callback)
    callback(null, data);
};


function _save_classifier(r, user, classifier) {
  r.set( 'stream:'+user, JSON.stringify( classifier ), function() {
    //L(arguments);
  } );

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
  var r = redis.createClient();
  var user = req.params.user;
  r.stream.on('connect', function() {
    r.get('stream:' + user, function (err, data) {
      classifier = new BayesClassifier();
      data = JSON.parse(data);
      if (data) {
        BayesClassifier.load(data, function(err, classifier) {
          var key = classifier.classify(text);
          res.send(key);
        });
      } else {
        res.send('Error - not recognized user');
      }
    });
  });
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
