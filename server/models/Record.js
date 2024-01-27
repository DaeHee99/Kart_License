const mongoose = require("mongoose");

const recordSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
    season: Number,
    record: [mongoose.SchemaTypes.Mixed],
    recordCount: [Number],
    mapCount: Object,
    license: String,
  },
  { timestamps: true }
);

recordSchema.pre("save", function (next) {
  const record = this;

  for (let i = 0; i < 6; i++) {
    const nowCount = record.recordCount
      .slice(0, i + 1)
      .reduce((a, b) => a + b, 0);

    if (nowCount >= 20) {
      if (i === 0) record.license = "강주력";
      else if (i === 1) record.license = "주력";
      else if (i === 2) record.license = "1군";
      else if (i === 3) record.license = "2군";
      else if (i === 4) record.license = "3군";
      else if (i === 5) record.license = "4군";
      next();
      break;
    } else if (i === 5) {
      record.license = "일반";
      next();
    }
  }
});

const Record = mongoose.model("Record", recordSchema);

module.exports = Record;
