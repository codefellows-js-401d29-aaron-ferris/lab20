'use strict';
/**
 * teams Model
 * @module src/models/api/teams/teams-model
 */
const Model = require('../server/mongo-model.js');
const schema = require('./teams-schema.js');

/**
 * Class that uses the methods from the model
 */
class Teams extends Model {}
/**
 * Exports the teams model
 * @param  {object} schema
 */
module.exports = new Teams(schema);

