
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const ClassSchema = mongoose.Schema({
    
    className: {type: String, required: true},
    teacherID: {type: Number, required: true},
    teacherName: {type: String, required: true},
    students: {type: Array}

})


ClassSchema.methods.apiRepr = function () {
    return { 

        id: this._id,
        teacherID: this.teacherID, 
        className: this.className, 
        teacherName: this.teacherName,
        students: this.students,

      };
  };


const Class = mongoose.models.Class || mongoose.model('Class', ClassSchema);

module.exports = { Class };