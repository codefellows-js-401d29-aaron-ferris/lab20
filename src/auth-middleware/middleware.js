'use strict';
/**
 * Middleware Router Middleware
 * @module /src/auth/auth-middleware/middleware.js
 */

/**
 * Model Finder Middleware
 * Exports the capability.
 * toggles basic, bearer, and error
 * defines what type of authorization
 */
const User = require('../models/auth/users/users-model.js');

module.exports = (capability) => {
  
  return (req, res, next) => {

    try {
      let [authType, authString] = req.headers.authorization.split(/\s+/);

      switch (authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
      }
    } catch (e) {
      _authError();
    }

    /**
     * Defines basic authorization
     */
    function _authBasic(str) {
    // str: am9objpqb2hubnk=
      let base64Buffer = Buffer.from(str, 'base64'); // <Buffer 01 02 ...>
      let bufferString = base64Buffer.toString();    // john:mysecret
      let [username, password] = bufferString.split(':'); // john='john'; mysecret='mysecret']
      let auth = {username, password}; // { username:'john', password:'mysecret' }

      return User.authenticateBasic(auth)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Defines bearer authorization
     */
    function _authBearer(authString) {
      return User.authenticateToken(authString)
        .then(user => _authenticate(user))
        .catch(_authError);
    }

    /**
     * Defines authentication that is used within basic and bearer
     */    
    function _authenticate(user) {
      if ( user && (!capability || (user.can(capability))) ) {
        req.user = user;
        req.token = user.generateToken();
        next();
      }
      else {
        _authError();
      }
    }

    /**
     * Defines error for the authentication
     */
    function _authError() {
      next('Invalid User ID/Password');
    }

  };
  
};