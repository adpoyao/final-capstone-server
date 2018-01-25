const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Class } = require('../classes/models');
const { User } = require('../users/models')
const { Mood } = require('./models')
const router = express.Router();
const jsonParser = bodyParser.json();

router.post('/', jsonParser, (req, res) => {
    
      let { studentID, moodType, caption, dateTime } = req.body;
        return Mood.create({ studentID: req.body.studentID, moodType: req.body.moodType, caption: req.body.caption})
        .then(Mood => {
          return res.status(201).json(Mood.apiRepr())
        })
        .catch(err => res.status(500).json({message: 'Internal server error'}));
        });
    
module.exports = {router};