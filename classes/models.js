// import { Schema } from 'mongoose';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassesSchema = mongoose.Schema({
    
    className: {
        type: String,
        required: true,
        },
    teacherID: {
        type: Number,
        required: true,
    },
    teacherName: {
        type: String,
        required: true,
    },
    students: {
        type: Array,
    }
})


ClassesSchema.methods.apiRepr = function () {
    return { 
        _id: this.id, 
        className: this.className, 
      };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };