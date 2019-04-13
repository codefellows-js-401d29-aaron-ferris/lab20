'use strict';
/**
 * Model Finder Middleware
 * @module index.js
 */

/**
 * Model Finder Middleware
 * Initiates the startprocess pulled from app.js
 */
require('dotenv').config();

// Start up DB Server
const mongoose = require('mongoose');
const options = {
  useNewUrlParser:true,
  useCreateIndex: true,
};
mongoose.connect(process.env.MONGODB_URI, options);

// Start the web server
require('./src/app.js').start(process.env.PORT);
