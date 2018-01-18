'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const { PORT } = require('./config');
const morgan = require('morgan');
const app = express();
const userRouter = require('./users/router')


app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
      skip: (req, res) => process.env.NODE_ENV === 'test'
  })
);

app.use(bodyParser.json());

let server = app
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

  // .catch(err => console.error(err));
  if (require.main === module) {
    runServer()
  }


  module.exports = { app, runServer, closeServer };
  