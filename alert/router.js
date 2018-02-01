'use strict';

const moment = require('moment');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Alert } = require('./models');
const { User } = require('../users/models');
const { Class } = require('../classes/models');
const { Mood } = require('../mood/models')
const router = express.Router()
const jsonParser = bodyParser.json();
// mongoose.Promise = require('bluebird');

//STUDENTS SENDING A PANIC ALERTS TO ALL THEIR TEACHERS
router.post('/panic/on', jsonParser, (req, res) => {
  let {studentID, active} = req.body;
  let y = [];
  return Class.find({students: req.body.studentID})
    .then(data => {
      for (let i = 0; i < data.length; i ++) {
        y.push(data[i].teacher);
      }
    })
  // .then(() => Alert.find({studentID: req.body.studentID, active: true}))
  // .count()
  // .then(count => {
  //   if (count > 0) {
  //     return Promise.reject({
  //       code: 422,
  //       reason: 'ValidationError',
  //       message: 'ALERT already sent',
  //       location: 'studentID'
  //     });
  //   }
  // })
    .then(() => {
      return Alert.create({ studentID: req.body.studentID, active: req.body.active, teachers: y})
    })
    .then(Alert => res.status(201).json(Alert.apiRepr()))
    .catch(err => res.status(500).json({message: 'Internal server error'}))
})

//STUDENTS TOGGLE PANIC ALERTS TO FALSE
router.put('/panic/off', jsonParser, (req, res) => {
  Alert.findByIdAndUpdate(req.body.alertID, {$set: {active: req.body.active}},
    function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.send('Everything seems to be working');
      }
    })
  //.then(alert => res.json(alert))
});
// ${API_BASE_URL}/alert/panic/dismiss/${data.panicID}`

////TEACHER DISMISSED A PANIC ALERT
router.put('/panic/dismiss/:panicID', jsonParser, (req, res) => {
  Alert.findByIdAndUpdate(req.params.panicID, {$pull: {teachers:req.body.teacherID}}) 
  .sort({dateTime: -1})
    .then(data => {
      console.log('data', data)
      res.status(200).json(data);
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

///REIEVE ALL ACTIVE PANIC ALERTS OF LINKED STUDENTS
router.get('/panic/:teacherID', (req, res) => {
  return Alert.find({teachers: req.params.teacherID, active: true})
    .populate('studentID', { 'username': 0, 'password': 0, '__v': 0 })
    .then(data => res.json(data));
});

////Retrieves all critical emotion alerts of linked students
router.get('/mood/:teacherID', (req, res) => {
  let start = moment().subtract(1440, 'minutes').toDate()
  let arrayMood = [];
  return Class.find({teacher: req.params.teacherID})
    //.populate('studentID', { 'username': 0, 'password': 0, '__v': 0 })
    .then((data) => {
      const promises = [];
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].students.length; j++) {
          promises.push(Mood.find({studentID: data[i].students[j], dateTime: { "$gte": start }}).populate('studentID', { 'username': 0, 'password': 0, '__v': 0 })
            .then((mood) => {
              let list = ['enraged', 'livid', 'fuming', 'anxious', 'repulsed', 'disgusted', 'pessimistic', 'alienated', 'despondent', 'despair', 'panicked', 'furious', 'frightened', 'apprehensive', 'troubled', 'glum', 'morose', 'miserable', 'depressed', 'hopeless', 'lonely', 'sullen', 'desolate'] //===>  WE CAN ADJUST THIS LIST BASED ON CRITICAL MOODS
              for (let i = 0; i < mood.length; i++) {
                if (list.includes(mood[i].moodType)) {
                  arrayMood.push(mood[i])
                }
              }
            }))
        }
      }
      return Promise.all(promises).then(() => {
        res.json(arrayMood);
      })
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

///Teacher: Retrieves all critical moods of a student
router.get('/panic/:teacherID/:studentID', (req, res) => {
  let arrayMood = [];
  return Alert.find({teachers: req.params.teacherID, studentID: req.params.studentID})
    //.populate('teachers', { 'username': 0, 'password': 0, '__v': 0 })
    .then((data) => {
      console.log(data)
      const promises = [];
      for (let i = 0; i < data.length; i++) {
        x = []
        promises.push(Mood.find({studentID: data[i].studentID})
          .then((mood) => {
            console.log('MOOOOD', mood)
            let list = ['enraged', 'livid', 'fuming', 'anxious', 'repulsed', 'disgusted', 'pessimistic', 'alienated', 'despondent', 'despair', 'panicked', 'furious', 'frightened', 'apprehensive', 'troubled', 'glum', 'morose', 'miserable', 'depressed', 'hopeless', 'lonely', 'sullen', 'desolate'] //===>  WE CAN ADJUST THIS LIST BASED ON CRITICAL MOODS
            for (let i = 0; i < mood.length; i++) {
              if (list.includes(mood[i].moodType)) {
                arrayMood.push(mood[i])
              }
            }
          }))
      }
      return Promise.all(promises).then(() => {
        console.log('THIS IS ARRAYMOOD',arrayMood);
        res.json(arrayMood);
      })
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}))
});

//////RETRIEVE ALRT from a student based on studentID
router.get('/:studentID/:alertID', (req, res) => {
  return Alert.find({studentID: req.params.studentID, _id: req.params.alertID, active: true})
    .populate('studentID', { 'username': 0, 'password': 0, '__v': 0 })
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.get('/', (req, res) => {
  return Alert.find()
    //.populate('studentID', { 'username': 0, 'password': 0, '__v': 0 })
    .then(data => res.json(data))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});




module.exports = router;