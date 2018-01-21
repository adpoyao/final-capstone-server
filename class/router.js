const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {
  return Class.find()
    .then(data => res.json(data.map(data => data.apiRepr())))
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
  });


router.post('/', jsonParser, (req, res) => {
  
  const requiredFields = ['className', 'firstName', '_id '];
  const missingField = requiredFields.find(field => !(field in req.body));

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

  return Class.find({ 
    className: req.class.className,
    firstName: req.class.firstName,
    id: request.class.id
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
      return Class.create({ className, firstName, id });
    })
    // .then(user => Question.find().then(questions => ({user, questions})))
    //     .then(({user, questions}) => {
    //         console.log(user, questions);
    //   // storing q's in empty user.questions []
    //   user.questions = questions.map((question, index) => {
    //     return {
    //       _id: question._id,
    //       question: question.question,
    //       answer: question.answer,
    //       mValue: 1,
    //       next: index === questions.length - 1 ? null: index + 1
    //     }
    //   })
    //   return user.save()
    // })
    .then(user => {
      return res.status(201).json(user.apiRepr())
    })
    .catch(err => {
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({ code: 500, message: 'Internal server error' });
    });
});



// router.put('/:id', jsonParser, (req, res) => {
//   const requiredFields = [ '_id', 'className',];
//   for (let i=0; i<requiredFields.length; i++) {
//     const field = requiredFields[i];
//     // console.log('field', field)
//     // console.log('req.body._id', req.body._id)
    
//     if (!(field in req.body)) {
//       const message = `Missing \`${field}\` in request body`
//       console.error(message);
//       return res.status(400).send(message);
//     }
//   }
//   if (req.params.id !== req.body.id) {
//     console.log('req.params.id', req.params.id)
//     console.log('req.body.id', req.body._id)
//     const message = `Request path id (${req.params.id}) and request body id (${req.body._id}) must match`;
//     console.error(message);
//     return res.status(400).send(message);
//   }
//   console.log(`Updating class \`${req.params.id}\``);
//   Class.update({
//     id: req.params.id,
//     className: req.body.className
//   });
//   res.status(204).end();
// });


router.delete('/:id', jsonParser, (req, res) => {
  Class
    .findByIdAndRemove(req.params._id);
    console.log(`Deleted shopping list item \`${req.params.id}\``);
    res.status(204).end();
  });

  
module.exports = router;