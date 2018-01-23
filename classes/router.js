const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Classes } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
  return Classes.find()
    .then(data => res.json(data.map(data => data.apiRepr())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
});


router.get('/search/:teacherName', (req, res) => {
 Classes.findById(req.params.studentID)
  .then(data => {
    res.json(data.apiRepr())
  })
  .catch(err => {
    res.status(500).json({ message: 'Internal server error' })
  });
})

router.get('/student/:studentID', (req, res) => {
 Classes.findById(req.params.id)
  .then(data => res.json(data.apiRepr()))
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
  
})

///////////////////////////////////////////////////////(WORKING)
router.post('/', jsonParser, (req, res) => {
  
  let { className, teacherName, teacherID } = req.body;
  return Classes.find({ 
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
      return Classes.create({ className, teacherName, teacherID });
    })
    .then(Classes => {
      return res.status(201).json(Classes.apiRepr())
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
  
  Classes.findByIdAndUpdate(req.params.classID, {$push: {students:{studentID: req.body.studentID, studentName: req.body.studentName}}},
    function(err){
      if(err) {
        console.log(err);
      }
      else {
        res.send('Everything seems to be working');
      }
    })
    
});


router.delete('/:studentID', (req, res) => {
  Classes
    .findByIdAndRemove(req.params.studentID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});





  
module.exports = router;