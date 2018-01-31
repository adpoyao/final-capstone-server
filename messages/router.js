const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Message } = require('./models');
const { Conversation } = require('./models')
const router = express.Router();
const jsonParser = bodyParser.json();


  // Retrieve single conversation

router.get('/:conversationId', (req, res) => {
    Message.find({ author: req.params.conversationId })
        // .select('createdAt composedMessage author')
        // .sort('-createdAt')
        // .populate('composedMessage')
        .then(messages => {
            console.log('messages', messages)
            res.status(200).json({ conversation: messages })
        })
})

 // Send reply in conversation

 router.post('/:conversationId', jsonParser, (req, res) => {
     let {composedMessage, author} = req.body
     return Message.create({
         conversationId: req.params.conversationId,
         composedMessage: req.body.composedMessage,
         author: req.user._id,
     })
     .then(() => {
         return res.status(200).json({
             message: 'Reply successfully sent'
         })
     })
 })







module.exports = router;
