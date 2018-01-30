const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const AlertSchema = mongoose.Schema({
    studentID: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    active: {type: Boolean, required: true},
    teachers: [{type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    dateTime: {type: Date, required: true, default: Date.now}
})

AlertSchema.methods.apiRepr = function () {
return {
    alertID: this._id,
    studentID: this.studentID || '',
    active: this.active,
    teachers: this.teachers || '',
    dateTime: this.dateTime || ''

}
}

const Alert = mongoose.models.Alert || mongoose.model('Alert', AlertSchema)

module.exports = { Alert } ;