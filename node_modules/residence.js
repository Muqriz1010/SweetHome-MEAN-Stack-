const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const residenceSchema = new Schema({
  owner: {type: Schema.Types.ObjectID, ref: 'Owner'},
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Residence', residenceSchema);
