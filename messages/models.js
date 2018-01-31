const mongoose = require('mongoose')  
mongoose.Promise = global.Promise;

const MessageSchema = mongoose.Schema({  
  conversationId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  composedMessage: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

module.exports = { Message }  