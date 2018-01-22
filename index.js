'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const classesRouter = require('./classes/router')
const { Classes } = require('./classes/models');
const app = express();

const { dbConnect } = require('./db-mongoose');
const mongoose = require('mongoose');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(bodyParser.json());

app.use('/classes', classesRouter);

let server
function runServer(port = PORT) {
  server = app.listen(port, () => {
    console.info(`App listening on port ${server.address().port}`);
  })
  .on('error', err => {
    console.error('Express failed to start');
    console.error(err);
  });
}
  
function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  dbConnect().then(() => {
    console.log('connected to DB')
  });
  runServer();
}

module.exports = { app, runServer, closeServer };
  