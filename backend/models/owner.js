const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: {type: String, required: true},
  title: {type: String, required: true},
  content: {type: String, required: true},
  imagePath: {type: String, required: true}
});

module.exports = mongoose.model('Owner', ownerSchema);
