const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({
    className: {
        type: String,
        required: true,
        }
})

ClassSchema.methods.apiRepr = function () {
    return { className: this.className };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };