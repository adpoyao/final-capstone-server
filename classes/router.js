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


router.get('/:studentID', (req, res) => {
 Classes.findById(req.params.studentID)
  .then(data => {
    res.json(data.apiRepr())
  })
  .catch(err => {
    res.status(500).json({ message: 'Internal server error' })
  });
})

// router.get('/:teacherID', (req, res) => {
//  Classes.findById(req.params.id)
//   .then(data => res.json(data.apiRepr()))
//   .catch(err => res.status(500).json({ message: 'Internal server error' }));
  
// })


router.post('/', jsonParser, (req, res) => {
  
  const requiredFields = ['className'];
  const missingField = requiredFields.find(field => !(field in req.body));
  // console.log('req.body', req.body)

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['className'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );

  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Incorrect field type: expected string',
      location: nonStringField
    });
  }

  const explicityTrimmedFields = ['className'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  const sizedFields = {
    className: { min: 1 }, 

  };
  const tooSmallField = Object.keys(sizedFields).find(
    field =>
      'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field =>
      'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let { className, id } = req.body;
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
      return Classes.create({ className });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr())
    })
    .catch(err => {
      console.log(err ,'err')
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});


router.put('/:studentID', jsonParser, (req, res) => {
  const requiredFields = [ 'id', 'className',];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
    if (req.params.studentID !== req.body.id) {
      const message = `Request path id (${req.params.studentID}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating class \`${req.params.studentID}\``);
    Classes
    .findByIdAndUpdate(req.params.studentID, {
      className: req.body.className
    })
    .then(data => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal Server error'}))
});


router.delete('/:studentID', (req, res) => {
  Classes
    .findByIdAndRemove(req.params.studentID)
    .then(() => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});

  
module.exports = router;