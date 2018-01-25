const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({

    className: {type: String, required: true},
    teacher: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    students: [
        {type: mongoose.Schema.Types.Mixed, ref: 'User'}
    ]
})

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
