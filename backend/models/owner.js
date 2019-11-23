const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
  name: {type: String, required: true},
  phonenum: {type: String, required: true}
});

module.exports = mongoose.model('Owner', ownerSchema);
