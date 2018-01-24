
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

// ================>>>>>Working<<<<<===============
// Retrieves all classes students searched for by teacher name

router.get('/search/:teacherName', (req, res) => {
  Class
    .find( {$text: { $search: req.params.teacherName }}, { students: 0})
    .then(data => res.json(data))
});

// {teacherName: { $regex: /^req.params.teacherName/i }}, { students: 0}

// Retrieves all classes a student is enrolled in
router.get('/student/:studentID', (req, res) => {
// console.log('req.params',req.params)
 Class.find()
  .then(classes => {
    console.log('classes', classes)
    let studentClasses = classes.map(i => {
      if (classes[i].student.studentID === req.params.studentID){
        studentClasses.push({
          _id: classes[i]._id,
          className: classes[i].className,
          teacherName: classes[i].teacherName,
        })
      }
      return res.json(studentsClasses)
  })
  .then(data => res.json(data.apiRepr()))
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
  })
})

///////////////////////////////////////////////////////(WORKING)
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


router.post('/', jsonParser, (req, res) => {

  let { className, teacherName, teacherID } = req.body;
  return Class.find({
    className: req.body.className,
   })
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'className already taken',
          location: 'className'
        });
      }
    })
    .then(() => {
      return Class.create({ className, teacherName, teacherID });
    })
    .then(Class => {
      return res.status(201).json(Class.apiRepr())
    })
    .catch(err => {
      console.log(err ,'err')
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


///////////////////////////////////////////////////////////(WORKING)
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

// Remove from an enrolled class
router.delete('/student/remove/:classID', (req, res) => {
  Class
    .findByIdAndRemove(req.params.classID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


// Close a class from future enrollment && delete class from any students enrolled
router.delete('/teacher/close/:classID', (req, res) => {
  Class
    .findByIdAndRemove(req.params.classID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


module.exports = router;
