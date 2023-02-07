const mongoose = require('mongoose');

const starSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  recordId: String,
  star: Number,
  text: String
}, { timestamps: true });

const Star = mongoose.model('Star', starSchema);

module.exports = Star;