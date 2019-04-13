'use strict';

/**
 * Players Model
 * @module src/models/api/players/players-model
 */

const Model = require('../server/mongo-model.js');
const schema = require('./players-schema');

class Players extends Model {}
/**
 * Gives access to the mongo-model functions and classes
 * @param  {object} schema
 */
module.exports = new Players(schema);

