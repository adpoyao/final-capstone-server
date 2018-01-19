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
<<<<<<< HEAD
   
=======
  
>>>>>>> adam
    const item = {
    'id':'123', 
    'firstName':'John', 
    'lastName':'Doe', 
    'username':'username', 
<<<<<<< HEAD
    'className':'BIO103'}

=======
    'className':'BIO103'
  }
>>>>>>> adam
    res.status(201).json(item);
});


router.put('/:id', jsonParser, (req, res) => {
    const updatedItem = {
      'id':'123', 
      'firstName':'John', 
      'lastName':'Doe', 
      'className':'BIO103'
    }
    res.status(200).json(updatedItem);
  });


router.delete('/:id', (req, res) => {
    res.status(204).end()
  });

  
module.exports = router;