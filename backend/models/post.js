const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
  user: {type: Schema.Types.ObjectID, ref: 'User'},
  residencename: {type: String, required: true},
  state: {type: String, required: true},
  address: {type: String, required: true},
  size: {type: String, required: true},
  price: {type: String, required: true},
  imagePath: {type: String, required: true},

});

module.exports = mongoose.model('Post', postSchema);
