'use strict';

const express = require('express');
const session = require('express-session');
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const router = express.Router();

const PORT = '8080';

const applyMiddlewares = app => {
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(session({
    secret: 'derp',
    saveUninitialized: true,
    resave: true,
  }))
};

const applyRoutes = app => {
  router.get('/auth', (req, res) => {
    if (!req.session.authorized) {
      req.session.authorized = true;
      return res.status(401).send('Unauthorized');
    }
    return res.status(200).send('Authorized');
  });

  router.delete('/auth', (req, res) => {
    req.session.destroy();
    res.status(200).send('Destroyed');
  });

  app.use('/api', router);
  app.route('/*').get((req, res) => {
    res.sendStatus(404);
  });
};

const expressConfig = app => {
  applyMiddlewares(app);
  applyRoutes(app);
};

const initExpress = () => {
  console.log('Loading express..');
  expressConfig(app);
  const server = http.createServer(app);

  return server
    .on('error', err => console.log(`Express server error: ${err.stack}`))
    .listen(PORT, () => console.log(`Listening on port ${PORT}.`));
};

(() => initExpress())();
