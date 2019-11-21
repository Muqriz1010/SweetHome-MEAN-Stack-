const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  applicant: {type: Schema.Types.ObjectID, ref: 'Applicant'},
  residence: {type: Schema.Types.ObjectID, ref: 'Residence'},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Application', applicationSchema);
