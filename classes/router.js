
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('./models');
const { User } = require('../users/models')
const router = express.Router();
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
  return Class.find()
  // .populate('className')
  .then(data => {
    console.log('data', data) 
    res.json(data)
  })
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

// ================>>>>>Working<<<<<===============
// Retrieves all classes students searched for by teacher name

//Retrive classes by teacher last name
router.get('/search/:lastName', (req, res) => {
  let userIds = [];

  User.find({lastName: new RegExp('^'+req.params.lastName+'$', "i"),  role: 'teacher'})
    .then(users => {
      userIds = users.map(user => user.id);
      return Class.find({teacher: {$in: userIds} }, {'__v': 0})
      .populate('teacher', { 'username': 0, 'password': 0 })
        .then(data => res.json(data));
    });
});

/////Retrieve classes a student enroll in
router.get('/student/:id', (req, res) => {
  return Class.find({students: req.params.id})
  .populate('students')
    .then(data => res.json(data));
  
});

/////Retrieve classes a student enroll in
router.get('/student/:id', (req, res) => {
      return Class.find({students: req.params.id})
      .populate('students')
      .populate('teacher')
        .then(data => res.json(data));
});


//Retrieve all classes a teacher create
router.get('/teacher/:id', (req, res) => {
  return Class.find({teacher: req.params.id})
  .populate('teacher')
    .then(data => res.json(data));

});

///////////////////////////////////////////////////////(WORKING)
//TEACHER CREATE CLASSES
router.post('/teacher/create', jsonParser, (req, res) => {

  let { className, id } = req.body;
    return Class.create({ className: req.body.className, teacher: req.body.id})
    .then(Class => {
      return res.status(201).json(Class.apiRepr())
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
    });


///////////////////////////////////////////////////////////(WORKING)
//STUDENTS ENROLL IN EXISTING CLASSES
router.put('/student/enroll/:classID', jsonParser, (req, res) => {
  return Class.find({_id: req.params.classID})
    .then(Class => {
      if (Class[0].students.includes(req.body.studentID)) {
        res.json({message: 'you were already enrolled in this class'})
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
});

//TEACHER EDITING EXISTING CLASSE(WORKING)
router.put('/teacher/edit/:classID', jsonParser, (req, res) => {
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
router.put('/student/remove/:classID', jsonParser, (req, res) => {
  Class.findByIdAndUpdate(req.params.classID, {$pull: {students:{student: req.body.id}}},
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
router.delete('/teacher/close/:classID', (req, res) => {
  Class
    .findByIdAndRemove(req.params.classID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = router;
