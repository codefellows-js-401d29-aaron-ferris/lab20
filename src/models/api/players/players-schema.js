'use strict';

/**
 * Players Schema
 * @module src/models/api/players/players-schema
 */

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

/**
 * Function that takes in an object that defines the properties and required data types for the player object
 */
const players = mongoose.Schema({
  name: { type:String, required:true },
  position: { type:String, required:true, uppercase:true, enum:['P','C','1B','2B','3B','SS','LF','RF','CF'] },
  throws: { type:String, required:true, uppercase:true, enum:['R','L'] },
  bats: { type:String, required:true, uppercase:true, enum:['R','L'] },
  team: {type:String, required:true},
});
/**
 * Exports the players module
 * @param  {object} players
 */
module.exports = mongoose.model('players', players);
