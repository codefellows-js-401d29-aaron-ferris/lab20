'use strict';
/**
 * APP
 * @module /src/app.js
 */

/**
 * app middleware
 * compiles all of the information from the routers
 * if none of the routers are run, run the 404 error
 * if a router is run but has an error, run the 500 error
 * @param req {object} Express Request Object
 * @param res {object} Express Response Object
 * @param next {function} Express middleware next()
 */
// 3rd Party Resources
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const swagger = require('swagger-ui-express');

// Esoteric Resources
const errorHandler = require( './error-middleware/500.js');
const notFound = require( './error-middleware/404.js' );
const authRouter = require( './routers/auth/router.js' );
const roleRouter = require('./routers/auth/role-router.js');
const apiRouter = require( `./routers/api/v1.js` );

// Prepare the express app
const app = express();

// App Level MW
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(apiRouter);

//Documentation Resources
app.use('/docs', express.static('docs'));

// const swaggerDocs = require('../docs/config/swagger.json');
// apiRouter.get('/swagger', swagger.server, swagger.setup(swaggerDocs));
// apiRouter.use('/api/v1/doc', swagger.serve, swagger.setup(swaggerDocs));

// Routes
app.use(authRouter);
app.use(roleRouter);

// Catchalls
app.use(notFound);
app.use(errorHandler);

let isRunning = false;

/**
 * Exports the function for running the app to the front page
 */
module.exports = {
  server: app,
  start: (port) => {
    if( ! isRunning ) {
      app.listen(port, () => {
        isRunning = true;
        console.log(`Server Up on ${port}`);
      });
    }
    else {
      console.log('Server is already running');
    }
  },
};
