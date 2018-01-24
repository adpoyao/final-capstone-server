
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('./models');
const { User } = require('../users/models')
const router = express.Router();
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
  return Class.find()
    .then(data => res.json(data.map(data => data.apiRepr())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


// Retrieves all classes students searched for by teacher name
router.get('/search/:teacherName', (req, res) => {
 Class
  .find({teacherName: req.params.teacherName})
  .then(classes => {
    let teacherClasses = [];
    for(let i = 0; i < classes.length; i++){
      if(classes[i].teacherName == req.params.teacherName){
        console.log('classes[i]', classes[i])
        teacherClasses.push({
          className: classes[i].className,
          teacherID: classes[i].teacherID,
          teacherClasses: classes[i].teacherClasses,
          students: classes[i].students
        })
      }
    }
    return res.status(200).json(teacherClasses)
  })
  .catch(err => {
    res.status(500).json({ message: 'Internal server error' })
  });
});


// Retrieves all classes a student is enrolled in
router.get('/student/:studentID', (req, res) => {
console.log('req.params',req.params)
 Class.find()
  .then(classes => {
    let studentClasses = [];
    classes.forEach(i => {
      if (classes[i].student.studentID === req.params.studentID){
        studentClasses.push({
          _id: classes[i]._id,
          className: classes[i].className,
          teacherName: classes[i].teacherName,
        })
      }
    return studentClasses
  })
  .then(data => res.json(data.apiRepr()))
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
  })
})


// Retrieves all classes a teacher created
router.get('/student/:teacherID', (req, res) => {
  console.log('req.params',req.params)
   Class.find()
    .then(classes => {
      let teacherClasses = [];
      classes.forEach(i => {
        if (classes[i].teacherID === req.params.teacherID){
          studentClasses.push({
            _id: classes[i]._id,
            className: classes[i].className,
            // not sure if we need to return next line
            students: classes[i].students,
          })
        }
      return teacherClasses
    })
    .then(data => res.json(data.apiRepr()))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
  })
})

///////////////////////////////////////////////////////(WORKING)
//TEACHER CREATE CLASSES
router.post('/teacher/create', jsonParser, (req, res) => {

  let { className, teacherName, teacherID } = req.body;
  return Class.find({
    className: req.body.className,
   })
    .then(() => {
      return Class.create({ className, teacherName, teacherID });
    })
    .then(Class => {
      return res.status(201).json(Class.apiRepr())
    })
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


///////////////////////////////////////////////////////////(WORKING)
//STUDENTS ENROLL IN EXISTING CLASSES
router.put('/student/enroll/:classID', jsonParser, (req, res) => {

  Class.findByIdAndUpdate(req.params.classID, {$push: {students:{studentID: req.body.studentID, studentName: req.body.studentName}}},
    function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.send('Everything seems to be working');
      }
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
  Class.findByIdAndUpdate(req.params.classID, {$pull: {students:{studentName: req.body.studentName,studentID: req.body.studentID}}},
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
