const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassesSchema = mongoose.Schema({
    
    className: {
        type: String,
        required: true,
        },
    firstName: {
        type: String,
    }, 
})

ClassesSchema.methods.apiRepr = function () {
    return { _id: this.id, className: this.className, firstName: this.firstName  };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };