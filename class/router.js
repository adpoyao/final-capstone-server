const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const jsonParser = bodyParser.json();


router.get('/', (req, res) => {

    res.json([{'classname': 'BIO103'}]);
  });


router.post('/', jsonParser, (req, res) => {

    const item = {'id':'123', 'firstName':'John', 'lastName':'Doe', 'username':'username', 'className':'BIO103'}
    res.status(201).json(item);
});


router.put('/:id', jsonParser, (req, res) => {
    const updatedItem = {'id':'123', 'firstName':'John', 'lastName':'Doe', 'className':'BIO103'}
    res.status(200).json(updatedItem);
  });


router.delete('/:id', (req, res) => {
    res.status(204).end()
  });

  
module.exports = router;