'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { PORT, CLIENT_ORIGIN, DATABASE_URL } = require('./config');
const classRouter = require('./classes/router');
const { Class } = require('./classes/models');
const { Mood } = require('./mood/models');
const { Alert } = require('./alert/models');
const alertRouter = require('./alert/router');
const { router: moodRouter } = require('./mood')
const { router: usersRouter } = require('./users');
const { router: yourStudentsRouter } = require('./students');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const passport = require('passport');
const app = express();
const cors = require('cors');

const http = require('http').Server(app);
const io = require('socket.io')(http);

const { dbConnect } = require('./db-mongoose');
const mongoose = require('mongoose');

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

let server;
function runServer() {
  return new Promise((resolve, reject) => {
    mongoose.connect(DATABASE_URL, err => {
      console.log(DATABASE_URL);
      if (err) {
        return reject(err);
      }
      server = http
        .listen(PORT, () => {
          console.log(`Your app is listening on port ${PORT}`);
          resolve();
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

io.on('connection', (socket) => {
  console.log('THIS IS YOUR SOCKET ID:', socket.id);

  socket.on('SEND_MESSAGE', function(data){
    io.emit('RECEIVE_MESSAGE', data);
  });

});










module.exports = { app, runServer, closeServer };
