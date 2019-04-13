'use strict';
/**
 * users model schema
 * @module src/models/api/auth/users/users-model
 */
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('../roles/roles-model.js');

const SINGLE_USE_TOKENS = !!process.env.SINGLE_USE_TOKENS;
const TOKEN_EXPIRE = process.env.TOKEN_LIFETIME || '5m';
const SECRET = process.env.SECRET || 'foobar';

const usedTokens = new Set();
/**
 @name users
 Users schema that determines the properties of a user and virtually joins the collection with the roles schema
 */
const users = new mongoose.Schema({
  username: {type:String, required:true, unique:true},
  password: {type:String, required:true},
  email: {type: String},
  role: {type: String, default:'user', enum: ['admin','superuser','editor','user']},
}, { toObject:{virtuals:true}, toJSON:{virtuals:true} });
/**
 * @name users.virtual
 * The virtual join for mongo that defines the matching fields between collections
 */
users.virtual('roles', {
  ref: 'roles',
  localField: 'role',
  foreignField: 'role',
  justOne: false,
});

const capabilities = {
  superuser: ['create','read','update','delete', 'superuser'],
  admin: ['create','read','update','delete'],
  editor: ['create', 'read', 'update'],
  user: ['read'],
};
/**
 * @name users.pre
 * before the user does stuff the password is hashed
 */
users.pre('save', function(next) {
  bcrypt.hash(this.password, 10)
    .then(hashedPassword => {
      this.password = hashedPassword;
      next();
    })
    .catch(error => {throw new Error(error);});
});
/**
 * @name users.statics.createFromOauth
 * uses emai. without email runs a validation error
 * finds the email or creates the email
 */
users.statics.createFromOauth = function(email) {

  if(! email) { return Promise.reject('Validation Error'); }

  return this.findOne( {email} )
    .then(user => {
      if( !user ) { throw new Error('User Not Found'); }
      return user;
    })
    .catch( error => {
      let username = email;
      let password = 'none';
      return this.create({username, password, email});
    });

};
/**
 * @name users.statics.authenticateToken
 * uses token
 * if token is in used tokens, reject it
 * verifiys the parsed tokens with a key and returns the query or invalid token
 */
users.statics.authenticateToken = function(token) {
  
  if ( usedTokens.has(token ) ) {
    return Promise.reject('Invalid Token');
  }
  
  try {
    let parsedToken = jwt.verify(token, SECRET);
    (SINGLE_USE_TOKENS) && parsedToken.type !== 'key' && usedTokens.add(token);
    let query = {_id: parsedToken.id};
    return this.findOne(query);
  } catch(e) { throw new Error('Invalid Token'); }
  
};
/**
 * @name users.statics.authenticateBasic
 * defines the authenticate basic
 */
users.statics.authenticateBasic = function(auth) {
  let query = {username:auth.username};
  return this.findOne(query)
    .then( user => user && user.comparePassword(auth.password) )
    .catch(error => {throw error;});
};
/**
 * @name users.statics.comparePassword
 * compares password to check correctness
 */
users.methods.comparePassword = function(password) {
  return bcrypt.compare( password, this.password )
    .then( valid => valid ? this : null);
};
/**
 * @name users.statics.generateToken
 * adds a generate token method
 */
users.methods.generateToken = function(type) {
  
  let token = {
    id: this._id,
    capabilities: capabilities[this.role],
    type: type || 'user',
  };
  
  let options = {};
  if ( type !== 'key' && !! TOKEN_EXPIRE ) { 
    options = { expiresIn: TOKEN_EXPIRE };
  }
  
  return jwt.sign(token, SECRET, options);
};

users.methods.can = function(capability) {
  return capabilities[this.role].includes(capability);
};

users.methods.generateKey = function() {
  return this.generateToken('key');
};
/**
 * exports users
 */
module.exports = mongoose.model('users', users);
