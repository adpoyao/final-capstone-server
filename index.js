'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config');

const app = express();

app.use(bodyParser.json());

function runServer(port = PORT) {
    const server = app
      .listen(port, () => {
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
    runServer();
  }


  module.exports = { app, runServer, closeServer };
  