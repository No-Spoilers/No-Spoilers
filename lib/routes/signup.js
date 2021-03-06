'use strict';

const router = require('express').Router();
const bodyparser = require('../bodyparser');
const User = require('../models/user');
const token = require('../auth/token');

router.post('', bodyparser, (req, res, next) => {
  const name = req.body.username;
  const pass = req.body.password;

  delete req.body.password;

  if (name == null || pass == null) {
    return next({ code: 400, error: 'username and password must be supplied' });
  }
  User.find({ username: name })
    .count()
    .then( count => {
      // check if username already exists
      if (count > 0) {
        res.send({ 'error': `username ${name} already exists`});
      }
      // create a user object, hash password, and save
      const user = new User(req.body);
      user.generateHash(pass);
      user.save()
      // create a token for subsequent requests
      .then( user => {
        return token.sign(user);
      })
      // send token back as response
      .then( token => {
        res.send(token);
      });
    })
    .catch(next);
});

module.exports = router;
