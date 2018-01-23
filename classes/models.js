// import { Schema } from 'mongoose';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassesSchema = mongoose.Schema({
    
    className: {type: String, required: true},
    teacherID: {type: String, required: true},
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
        teacherID: this.teacherID,
        className: this.className || '',
        teacherName: this.teacherName || '',
        students: this.students || ''
      };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };