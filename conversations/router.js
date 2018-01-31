const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { Conversation } = require('./models')
const { Message } = require('../messages/models');
const router = express.Router();
const jsonParser = bodyParser.json();



// View messages to and from  user

router.get('/:id', (req, res) => {
    return Conversation.find({ participants: req.params.id })
    .select('_id')
    .then(conversations => {

        let fullConversations = [];
        conversations.forEach((conversation) => {
            Message.find({ 'conversationId': conversation._id })
            .sort('-createdAt')
            .limit(1)
            .populate({
                path: "author",
                select: "firstName lastName"
            })
            .then(message => {
                fullConversations.push(message);
                if(fullConversations.length === conversations.length){
                    return res.status(200).json( { conversations: fullConversations })
                }
            })
        })
    })
    .catch(err => res.status(500).json({ message: 'Internal server error' }));
  });




  // Start new conversation
router.post('/new/:recipient', jsonParser, (req, res) => {
    if(!req.params.recipient) {
        return res.status(422).sendStatus({ error: 'Please choose a valid recipient for your message'})
    }
    if(!req.body.composedMessage){
        return res.status(422).send({error: 'Please enter a message'})
    }

    let   composedMessage  = req.body;

    return Conversation.create({ participants: [req.body.id, req.params.recipient] })
    .then((data) => {
        // console.log('data', data)
        return Message.create({ 
            composedMessage: req.body.composedMessage,
            author: req.body.id,
            conversationId: req.body.id
        })
    })
    .then((conversation) => {
        return res.status(200).json({ 
            message: 'Conversation started!', 
            conversationId: conversation.id
        })
    })
    .catch(err => {
        console.log('err', err)
        res.status(500).json({message: 'Internal server error.'})})
})


  module.exports = router;

  
