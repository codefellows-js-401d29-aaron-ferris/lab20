'use strict';
/**
 * router 
 * @module src/routers/auth/router.js
 */

/**
 * Router
 * devines the routes signup signin oauth and key
 */
const express = require('express');
const authRouter = express.Router();
const Q = require('@nmq/q/client');


const User = require('../../models/auth/users/users-model.js');
const auth = require('../../auth-middleware/middleware.js');
const oauth = require('../../oauth/google.js');
/**
 * defines the signup route
 */
authRouter.post('/signup', (req, res, next) => {
  let user = new User(req.body);
  user.save()
    .then( (user) => {
      req.token = user.generateToken();
      req.user = user;
      res.set('token', req.token);
      res.cookie('auth', req.token);
      res.send(req.token);
      Q.publish('database','create', 'new signup');

    })
    .catch(next);
});
/**
 * defines the signin route
 */
authRouter.post('/signin', auth(), (req, res, next) => {
  res.cookie('auth', req.token);
  res.send(req.token);
});
/**
 * defines the oauth route
 */
authRouter.get('/oauth', (req,res,next) => {
  oauth.authorize(req)
    .then( token => {
      res.status(200).send(token);
    })
    .catch(next);
});
/**
 * defines the key route
 */
authRouter.post('/key', auth, (req,res,next) => {
  let key = req.user.generateKey();
  res.status(200).send(key);
});

module.exports = authRouter;
