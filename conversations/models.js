const mongoose = require('mongoose')
mongoose.Promise = global.Promise;
  

// Schema defines how chat messages will be stored in MongoDB
const ConversationSchema = mongoose.Schema({  
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
});


const Conversation = mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

module.exports = { Conversation }  