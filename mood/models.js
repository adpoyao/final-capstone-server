const mongoose = require('mongoose');

mongoose.Promise = global.Promise;


const MoodSchema = mongoose.Schema({
    studentID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    moodType: {type: String, required: true},
    caption: {type: String, required: false},
    dateTime: {type: Date, required: true, default: Date.now}
})

MoodSchema.methods.apiRepr = function () {
    return {
        moodID: this._id,
        studentID: this.studentID || '',
        moodType: this.moodType || '',
        caption: this.caption || '',
        dateTime: this.dateTime || ''
   };

}
const Mood = mongoose.models.Mood || mongoose.model('Mood', MoodSchema);

module.exports = { Mood };
