// import { Schema } from 'mongoose';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassesSchema = mongoose.Schema({
    
    className: {type: String, required: true},
    teacher: {type: mongoose.Schema.Types.Mixed},
    teacherName: {type: String, required: true},
    students: [
        {
            studentID: {type: String, required: false},
            studentName: {type: String, required: false}
        }
    ]
})

ClassesSchema.methods.apiRepr = function () {
    return { 
        classID: this._id,
        teacher: this.teacher,
        className: this.className || '',
        teacherName: this.teacherName || '',
        students: this.students || ''
      };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };