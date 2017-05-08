/**
 * Lunch location selection application
 * William Drescher
 * 1 May 2017
 */

'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const http = require('http');
const https = require('https');
const MongoClient = require('mongodb').MongoClient;
const morgan = require('morgan');

// Load server routes
const userRoute = require('./routes/user');

const errors = require('./errors');
const configuration = require('./server-config.json');

if (!configuration.mongo || !configuration.mongo.database) {
  console.error('FATAL: No MongoDB database name specified');
  process.exit();
}

const mongoHostname = configuration.mongo.hostname || '127.0.0.1';
const mongoPort = configuration.mongo.port || '27017'
const mongoDb = configuration.mongo.database;

const mongoUrl = mongoHostname + ':' + mongoPort + '/' + mongoDb;
MongoClient.connect('mongodb://' + mongoUrl, (err, db) => {
  if (err) {
    console.error(err);
    process.exit();
  }

  // Create the application
  const app = express();
  app.use(morgan('common'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));

  app.locals.config = configuration;
  app.locals.db = db;

  app.get('/', (req, res) => {
    res.status(200);
    res.type('json');
    res.send({status: 'OK'});
  });

  app.use('/user', userRoute);

  /**
   * Handles all errors from the application based on error
   * code and message
   */
  app.use((err, req, res, next) => {
    if ((typeof err === 'undefined') || (!err.code)) {
      err = {code: -1};
    }

    res.status(err.status || 500);
    res.type('json');
    res.json({
      error: errors.errors[err.code]
    });
  });

  if (configuration.use_https) {
    https.createServer(configuration.https_options, app)
      .listen(configuration.port, configuration.hostname);
    console.log('Started listening on https://' + configuration.hostname + ':' + configuration.port + '/');
  } else {
    http.createServer(app)
      .listen(configuration.port, configuration.hostname);
    console.log('Started listening on http://' + configuration.hostname + ':' + configuration.port + '/');
  }
});

