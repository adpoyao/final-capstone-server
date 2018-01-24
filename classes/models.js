const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({

    className: {type: String, required: true},
    teacher: 
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
        },
    students: [
        {
        type: mongoose.Schema.Types.ObjectId, //string with ID of rest
		ref: 'User',
        },
    ]
})

ClassSchema.methods.apiRepr = function () {
    return {
        classID: this._id,
        teacher: this.teacher,
        className: this.className || '',
        students: this.students || '',
      };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };
