const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({

    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    className: {type: String, required: true},
    classPeriod: {type: String, required: false},
    students: [
        {type: mongoose.Schema.Types.Mixed, ref: 'User'}
    ],
    phone: {type: String, require: false},
    email: {type: String, required: false},
}, { strict: false })

ClassSchema.methods.apiRepr = function () {
    return {
        classID: this._id,
        className: this.className || '',
        teacher: this.teacher || '',
        students: this.students || ''
      };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };
