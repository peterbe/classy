Classy
======

What it does
------------

An online Bayesian classifier for anybody via a REST API.


Installation
------------

* [Node](http://nodejs.org/)
* [node-uuid](https://github.com/broofa/node-uuid) (`npm install node-uuid`)
* [express](http://expressjs.com/) (`npm install express`)
* [jade](https://github.com/visionmedia/jade/) (`npm install jade`)
* [natural](http://www.chrisumbel.com/article/node_js_natural_language_porter_stemmer_lancaster_bayes_naive_metaphone_soundex) (`npm install natural`)

Training
--------

URL:

```
POST <prefix>/train/key/:key
POST <prefix>/train/key/:key/user/:user
```

PARAMETERS:

* `text` - required

NOTES:

Without a user as a parameter you get a user ID returned and then you
can use that on all consecutive training sessions so that you can
build up your own training classifier.


Guessing
--------

URL:

```
POST <prefix>/guess/user/:user
```

PARAMETERS:

* `text` - required

NOTES:

Will return the classified key.
