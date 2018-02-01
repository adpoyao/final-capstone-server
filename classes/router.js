'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('./models');
const { User } = require('../users/models')
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const jwtAuth = passport.authenticate('jwt', {session:false});


router.get('/', (req, res) => {
  return Class.find()
      .then(data => {
        res.json(data)
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// ================>>>>>Working<<<<<===============
// Retrieves all classes students searched for by teacher name

//Retrive classes by teacher last name
router.get('/search/:lastName',jwtAuth, (req, res) => {
  let userIds = [];
  User.find({lastName: { "$regex": req.params.lastName, "$options": "i" },  role: 'teacher'})
    .then(users => {
      userIds = users.map(user => user.id);
      return Class.find({teacher: {$in: userIds} }, {'__v': 0})
      .populate('teacher', { 'username': 0, 'password': 0 })
        .then(data => res.json(data));
    });
});

/////Retrieve classes a student enroll in
router.get('/student/:id',jwtAuth, (req, res) => {
    return Class.find({students: req.params.id})
        .populate('students')
        .populate('teacher', { 'username': 0, 'password': 0, '__v': 0 })
        .then(data => res.json(data));
});


//Retrieve all classes a teacher create
router.get('/teacher/:id',jwtAuth, (req, res) => {
    return Class.find({teacher: req.params.id})
      .populate('teacher')
      .then(data => res.json(data));

});

///////////////////////////////////////////////////////(WORKING)
//TEACHER CREATE CLASSES
router.post('/teacher/create',jwtAuth, jsonParser, (req, res) => {
    let { id, className, classPeriod, email, phone } = req.body;
    return Class.create({ teacher: id, className, classPeriod, email, phone })
      .then(Class => {
        return res.status(201).json(Class.apiRepr())
      })
      .catch(err => res.status(500).json({message: 'Internal server error'}));
    });


///////////////////////////////////////////////////////////(WORKING)
//STUDENTS ENROLL IN EXISTING CLASSES
router.put('/student/enroll/:classID',jwtAuth, jsonParser, (req, res) => {
  return Class.find({_id: req.params.classID})
    .then(Class => {
      if (Class[0].students.includes(req.body.studentID)) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'you were already enrolled in this class',
          location: '_id'
        });
      }
    })
    .then(() => {
      return Class.findByIdAndUpdate(req.params.classID, {$push: {students:req.body.studentID}},
        function(err){
          if(err) {
            console.log(err);
          }
          else {
            res.send('Everything seems to be working');
          }
        })
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code);
      }
      console.error(err)
      res.status(500).json({code: 500, message: 'Internal server error'});
    })
});

//TEACHER EDITING EXISTING CLASSE(WORKING)
router.put('/teacher/edit/:classID',jwtAuth, jsonParser, (req, res) => {
  Class.findByIdAndUpdate(req.params.classID, {$set: {className:req.body.className}},
    function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.send('Everything seems to be working');
      }
    });
});

// Remove from an enrolled class
router.put('/student/remove/:classID',jwtAuth, jsonParser, (req, res) => {
  Class.findByIdAndUpdate(req.params.classID, {$pull: {students:req.body.studentID}},
    function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.sendStatus(204);
      }
    });
});

// Close a class from future enrollment && delete class from any students enrolled(WORKING)
router.delete('/teacher/close/:classID',jwtAuth, (req, res) => {
  Class
    .findByIdAndRemove(req.params.classID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = router;
