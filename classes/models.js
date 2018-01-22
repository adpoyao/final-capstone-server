import { Schema } from 'mongoose';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassesSchema = mongoose.Schema({
    
    className: {
        type: String,
        required: true,
        },
    // contactEmail: {
    //     type: String,
    //     // required: true,
    // },
    // contactPhone: {
    //     type: Number,
    //     // required: true,
    // },
    // archived:  {
    //     type: Boolean,
    //     default: false,
    // },
    // teacherID: {
    //     type: Schema.Types.ObjectId,
    //     ref: "User"
    // },
//     studentID: {
//             type: Schema.Types.ObjectId,
//             ref: "User"
//         }
})

// const UserSchema = mongoose.Schema({
//     _id: Schema.Types.ObjectId,
//     firstName: String,
// }) git


ClassesSchema.methods.apiRepr = function () {
    return { 
        _id: this.id, 
        className: this.className, 
      };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };