
'use strict';

const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Class } = require('../classes/models');
const { Mood } = require('../mood/models');
const { User } = require('../users/models');

const router = express.Router();

router.get('/:teacherID', (req, res) => {
  let result;

  return Class.find({teacher: req.params.teacherID})
    .lean()
    .populate('students', { 'username': 0, 'password': 0, '__v': 0, 'role': 0})
    .then(data => {
      result = data;

      for(let i=0; i<result.length; i++){
        for(let j=0; j<result[i].students.length; j++){
          Mood.find({studentID: result[i].students[j]._id}, {'studentID': 0, '__v': 0})
            .limit(1)
            .sort({ _id: -1 })
            .then(data => {
              result[i].students[j].lastMood = data;
            });
        }
      }
      res.status(200).json(result);
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/detail/:studentID', (req, res) => {
  return Mood.find({studentID: req.params.studentID}, {'__v': 0})
    .populate('studentID', {'__v':0, '_id': 0, 'username': 0, 'password': 0, 'role': 0})
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


//   return User.find({_id: req.params.studentID}, { 'username': 0, 'password': 0, '__v': 0, 'role': 0})
//     .then(data => {
//       result = data;
//       return Mood.find({studentID: req.params.studentID}, {'__v': 0, 'studentID': 0})
//         .then(data => {
//           result[0].mood = data;
//           console.log(result[0].mood);
//           res.status(200).json(result[0]);
//         });
//     })
//     .catch(err => res.status(500).json({message: 'Internal server error'}));
// });

module.exports = { router };