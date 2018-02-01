'use strict';

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const { Class } = require('../classes/models');
const { Mood } = require('../mood/models');
const { User } = require('../users/models');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', {session:false});
const router = express.Router();

router.get('/:teacherID',jwtAuth, (req, res) => {
  let result;

  return Class.find({teacher: req.params.teacherID})
    .lean()
    .populate('students', { 'username': 0, 'password': 0, '__v': 0, 'role': 0})
    .then(data => {
        result = data
        res.status(200).json(result);
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/detail/:studentID',jwtAuth, (req, res) => {
  return Mood.find({studentID: req.params.studentID}, {'__v': 0})
    .populate('studentID', {'__v':0, '_id': 0, 'username': 0, 'password': 0, 'role': 0})
    .sort({dateTime: -1})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = { router };