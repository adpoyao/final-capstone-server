
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({

    className: {type: String, required: true},
    teacher: {type: mongoose.Schema.Types.Mixed},
    teacherName: {type: String, required: true, text: true},
    students: [
        {
            studentID: {type: String, required: false},
            studentName: {type: String, required: false}
        }
    ]
})

ClassSchema.methods.apiRepr = function () {
    return {
        classID: this._id,
        teacher: this.teacher,
        className: this.className || '',
        teacherName: this.teacherName || '',
        students: this.students || ''
      };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };
