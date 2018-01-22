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
    console.log(err, 'err router.js')
    res.status(500).json({ message: 'Internal server error' })
  });
})

// router.get('/:teacherID', (req, res) => {
//  Classes.findById(req.params.id)
//   .then(data => res.json(data.apiRepr()))
//   .catch(err => res.status(500).json({ message: 'Internal server error' }));
  
// })


router.post('/', jsonParser, (req, res) => {
  
  const requiredFields = ['className', 'firstName'];
  const missingField = requiredFields.find(field => !(field in req.body));
  console.log('req.body', req.body)

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['className', 'firstName'];
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
    // firstName: {min: 1}
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

  let { className, firstName, id } = req.body;
  console.log('req.body line 86', req.body)
  return Classes.find({ 
    className: req.body.className,
    firstName: req.body.firstName,
    // id: req.body.id
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
      // return User.hashPassword(password);
    })
    .then(() => {
      return Classes.create({ className, firstName });
    })
    // .then(user => Question.find().then(questions => ({user, questions})))
    //     .then(({user, questions}) => {
    //         console.log(user, questions);
    //   // storing q's in empty user.questions []
    //   user.questions = questions.map((question, index) => {
    //     return {
    //       id: question.id,
    //       question: question.question,
    //       answer: question.answer,
    //       mValue: 1,
    //       next: index === questions.length - 1 ? null: index + 1
    //     }
    //   })
    //   return user.save()
    // })
    .then(user => {
      // console.log('user', user)
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


router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = [ 'id', 'className',];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    // console.log('req.body', req.body),
    // console.log('req.params', req.params)
    
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
    if (req.params.id !== req.body.id) {
      console.log('req.params.id', req.params.id)
      console.log('req.body.id', req.body.id)
      const message = `Request path id (${req.params.id}) and request body id (${req.body.id}) must match`;
      console.error(message);
      return res.status(400).send(message);
    }
    console.log(`Updating class \`${req.params.id}\``);
    Classes
    .findByIdAndUpdate(req.params.id, {
      className: req.body.className
    })
    .then(data => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal Server error'}))
});


router.delete('/:id', (req, res) => {
  console.log(req.params, 'req.params')/
  Classes
    .findByIdAndRemove(req.params.id)
    .then(() => res.status(204).end())
    // console.log(`Deleted class \`${req.params.id}\``)
    .catch(err => res.status(500).json({message: 'Internal server error'}));
  });

  
module.exports = router;