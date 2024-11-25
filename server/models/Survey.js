const mongoose = require("mongoose");

const surveySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    license: String,
    level: Number,
    balance: Number,
    review: String,
    season: Number,
  },
  { timestamps: true }
);

const Survey = mongoose.model("Survey", surveySchema);

module.exports = Survey;
