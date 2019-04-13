'use strict';
/**
 * teams schema
 * @module src/models/api/teams/teams-schema
 */
const players = require('../players/players-schema.js');
const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

/**
 * Provides a mechanism to pull object data from other modules into the teams schema
 * @param  {object}} with parameters
 */
const teams = mongoose.Schema({
  name: { type:String, required:true },
}, { toObject:{virtuals:true}, toJSON:{virtuals:true} });

/**
 * Defines the properties to push from the players collection into the teams collection
 * @param  {collection} 'players'
 */
teams.virtual('players', {
  ref: 'players',
  localField: 'name',
  foreignField: 'team',
  justOne:false,
});

/**
 * Populates the teams collection with players before the data is returned after a request
 * @param  {method} 'find'
 */
teams.pre('find', function() {
  try {
    this.populate('players');
  }
  catch(e) {
    console.error('Find Error', e);
  }
});

/**
 * Exports the teams schema
 * @param  {schema} teams
 */
module.exports = mongoose.model('teams', teams);
