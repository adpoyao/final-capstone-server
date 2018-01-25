
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

// Retrieves all classes students searched for by teacher name

router.get('/search/:lastName', (req, res) => {
  let userIds = [];
  User.find({lastName: req.params.lastName,  role: 'teacher'})
    .then(users => {
      console.log('users', users)
      userIds = users.map(user => user._id);
      return Class.find({teacher: {$in: userIds}})
        .then(data => {
          console.log('data', data)
          res.json(data)});
    });
});

/////Retrieve classes a student enroll in
router.get('/student/:id', (req, res) => {
  return Class.find({students: req.params.id})
  .populate('students')
    .then(data => res.json(data));

});

//Retrieve all classes a teacher create
router.get('/teacher/:id', (req, res) => {
return Class.find({teacher: req.params.id})
// .populate('teacher')
.then(data => res.json(data));

});

router.post('/', jsonParser, (req, res) => {

  let { className, teacherName, teacherID, studentName, studentID } = req.body;
  return Class.find({
    className: req.body.className,
   })
    // .count()
    // .then(count => {
    //   if (count = 0) {
    //     return Promise.reject({
    //       code: 422,
    //       reason: 'ValidationError',
    //       message: 'className already taken',
    //       location: 'className'
    //     });
    //   }
    // })
    .then(() => {
      return Class.create({ className, teacherName, teacherID, studentName, studentID });
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
