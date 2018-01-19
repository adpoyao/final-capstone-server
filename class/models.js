const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
        }
})

ClassSchema.methods.apiRepr = function () {
    return { username: this.username };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };