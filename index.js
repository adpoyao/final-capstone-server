'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { PORT } = require('./config');
const classRouter = require('./class')
const { Class } = require('./class/models');
const app = express();

const { dbConnect } = require('./db-mongoose');
const mongoose = require('mongoose');

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(bodyParser.json());

app.use('/class', classRouter);

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
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer()
}

module.exports = { app, runServer, closeServer };
  