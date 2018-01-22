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

ClassesSchema.path('')


ClassesSchema.methods.apiRepr = function () {
    return { 
        _id: this.id, 
        className: this.className, 
      };
  };


const Classes = mongoose.models.Classes || mongoose.model('Classes', ClassesSchema);

module.exports = { Classes };