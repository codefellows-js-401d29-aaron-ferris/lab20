'use strict';
/**
 * teams schema
 * @module src/models/api/auth/roles/roles-model
 */
const mongoose = require('mongoose');
/**
 * @name rolesSchema
 * defines the properties of a role
 */
const rolesSchema = new mongoose.Schema({
  role: {type: String, required:true},
  capabilities: {type: Array, required:true},
});
/**
 * exports roles
 */
module.exports = mongoose.model('roles', rolesSchema);
