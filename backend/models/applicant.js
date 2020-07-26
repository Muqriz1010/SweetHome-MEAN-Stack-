const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const applicantSchema = new Schema({
  user: {type: Schema.Types.ObjectID, ref: 'User'},
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Applicant', applicantSchema);
