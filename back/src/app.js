const path = require('path');
const favicon = require('serve-favicon');
const compress = require('compression');
const helmet = require('helmet');
const cors = require('cors');
const logger = require('./logger');
require('dotenv').config();

if (!process.env.DB) {
  console.log('External DB not found => using local DB');
  process.env.DB = 'mongodb://localhost:27017/traqnight';
}

if (!process.env.HERE_APP_ID) throw Error('HERE_APP_ID not found in .env file');
if (!process.env.HERE_APP_CODE)
  throw Error('HERE_APP_CODE not found in .env file');
if (!process.env.REACT_APP_GOOGLE_MAP_API_KEY)
  throw Error('REACT_APP_GOOGLE_MAP_API_KEY not found in .env file');

const feathers = require('@feathersjs/feathers');
const configuration = require('@feathersjs/configuration');
const express = require('@feathersjs/express');
const socketio = require('@feathersjs/socketio');

const middleware = require('./middleware');
const services = require('./services');
const appHooks = require('./app.hooks');
const channels = require('./channels');

const authentication = require('./authentication');

const mongodb = require('./mongodb');

const app = express(feathers());

// Load app configuration
app.configure(configuration());

// Enable security, CORS, compression, favicon and body parsing
app.use(helmet());
app.use(cors());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (app.locals.settings.env !== 'development') {
  app.use(favicon(path.join(app.get('public'), 'favicon.ico')));
  // Host the public folder
  app.use('/', express.static(app.get('public')));
  app.use('/admin', express.static(app.get('public')));
  app.use('/login', express.static(app.get('public')));
  app.use('/logout', express.static(app.get('public')));
  app.use('/register', express.static(app.get('public')));
}

// Set up Plugins and providers
app.configure(express.rest());
app.configure(socketio());

app.configure(mongodb);

// Configure other middleware (see `middleware/index.js`)
app.configure(middleware);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

app.hooks(appHooks);
module.exports = app;
