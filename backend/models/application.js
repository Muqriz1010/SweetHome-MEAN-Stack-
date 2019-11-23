const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const applicationSchema = new Schema({
  applicant: {type: Schema.Types.ObjectID, ref: 'User'},
  residence: {type: Schema.Types.ObjectID, ref: 'Post'},
  applicationdate: {type: String, required: true},
  stayfrom: {type: String, required: true},
  stayto: {type: String, required: true},
  status: {type: String, required: true}
});

module.exports = mongoose.model('Application', applicationSchema);
