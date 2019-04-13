'use strict';
/**
 * Role router Middleware
 * @module src/routers/auth/role-router.js
 */

/**
 * Model Finder Middleware
 * Initiates the startprocess pulled from app.js
 */
const express = require('express');
const rolesRouter = express.Router();
const Q = require('@nmq/q/client');

const Role = require('../../models/auth/roles/roles-model.js');

/**
 * @name rolesRouter.post()
 * Sends a new role to the database
 */
rolesRouter.post('/roles', (req,res,next) => {
  let role = new Role(req.body);
  role.save();
  res.status(200).send('Saved a new role to the db');
  Q.publish('database','create', 'Saved a new role to the db');

});

module.exports = rolesRouter;
