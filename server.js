/**
 * Lunch location selection application
 * William Drescher
 * 1 May 2017
 */

'use strict';

const express = require('express');
const http = require('http');
const https = require('https');

// Load server routes
const userRoute = require('./routes/user');

const configuration = require('./server-config.json');

// Create the application
const app = express();

app.locals.config = configuration;

app.use('/user', userRoute);

app.get('/', (req, res) => {
  res.status(200);
  res.send('OK');
});

if (configuration.use_https) {
  https.createServer(configuration.https_options, app)
    .listen(configuration.port, configuration.hostname);
  console.log('Server started on https://' + configuration.hostname + ':' + configuration.port + '/');
} else {
  http.createServer(app)
    .listen(configuration.port, configuration.hostname);
  console.log('Server started on http://' + configuration.hostname + ':' + configuration.port + '/');
}

