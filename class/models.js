const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({
    className: {
        type: String,
        required: true,
        },
    firstName: {
        type: String,
    }, 
    _id: {
        type: Number
    }
})

ClassSchema.methods.apiRepr = function () {
    return { className: this.className, firstName: this.firstName };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };