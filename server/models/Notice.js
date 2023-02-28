const mongoose = require('mongoose');

const noticeSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  content: String,
  show: Boolean
}, { timestamps: true });

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;