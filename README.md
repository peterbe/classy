Classy
======

What it does
------------

An online Bayesian classifier for anybody via a REST API.


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
