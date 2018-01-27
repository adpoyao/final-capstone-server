const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('../classes/models');
const { User } = require('../users/models')
const { Mood } = require('./models')
const router = express.Router();
const jsonParser = bodyParser.json();

// Creates new mood for user

router.post('/', jsonParser, (req, res) => {
    
let { studentID, moodType, caption, dateTime } = req.body;
  return Mood.create({ studentID: req.body.studentID, moodType: req.body.moodType, caption: req.body.caption})
    .then(Mood => {
      return res.status(201).json(Mood.apiRepr())
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});


// Obtains all of user's submitted moods

router.get('/:studentID', (req, res) => {
  return Mood.find({studentID: req.params.studentID}, {'_id': 0, '__v': 0})
    .then((data) => {
      console.log('data.moodType', data)
     return Mood.aggregate([
       {
         $group:
          {
            _id: 0,
            moodType: { $sum: "moodType"},
            count: { $sum: 1 }
          }
       }
     ])
    })    
    .then(data => res.json(data))
})

// Used for testing

router.get('/', (req, res) => {
  return Mood.find()
    .populate('studentID')
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});
    
module.exports = {router};