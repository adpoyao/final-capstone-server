'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const classRouter = require('./classes/router');
const conversationsRouter = require('./conversations/router')
const messageRouter = require('./messages/router')
const { Class } = require('./classes/models');
const { Mood } = require('./mood/models');
const { Alert } = require('./alert/models');
const alertRouter = require('./alert/router');
const { router: moodRouter } = require('./mood')
const { router: usersRouter } = require('./users');
const { router: yourStudentsRouter } = require('./students');
// const { router: chatRouter } = require('./conversations/router')
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const passport = require('passport');
const app = express();
const cors = require('cors');

const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));
app.use('/assets', express.static('assets'));



const { dbConnect } = require('./db-mongoose');
const mongoose = require('mongoose');

const {socketServer} = require('./socketEvents')

socketServer(io);  

app.use(morgan('common'));

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use(cors({
  origin: CLIENT_ORIGIN
}));

app.use(bodyParser.json());
const jwtAuth = passport.authenticate('jwt', { session: false });
app.use('/api/classes/', classRouter);
app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/mood/', moodRouter);
app.use('/api/alert/', alertRouter);
app.use('/api/yourStudents/', yourStudentsRouter);
app.use('/api/conversations/', conversationsRouter);
app.use('/api/messages/', messageRouter);


let server

function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      console.log(DATABASE_URL);
      if (err) {
        return reject(err);
      }
      server = http.listen(PORT, function() {
          console.log('listening on port', PORT);
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
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
  runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
