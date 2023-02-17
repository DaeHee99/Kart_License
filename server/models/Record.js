const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: "User"
  },
  season: Number,
  record: [mongoose.SchemaTypes.Mixed],
  recordCount: [Number],
  mapCount: Object,
  license: String
}, { timestamps: true });

recordSchema.pre('save', function (next) {
  let record = this;

  if(record.recordCount[0] >= 20) {
    record.license = '강주력';
    next();
  }
  else if(record.recordCount[0] + record.recordCount[1] >= 20) {
    record.license = '주력';
    next();
  }
  else if(record.recordCount[0] + record.recordCount[1] + record.recordCount[2] >= 20) {
    record.license = '1군';
    next();
  }
  else if(record.recordCount[0] + record.recordCount[1] + record.recordCount[2] + record.recordCount[3] >= 20) {
    record.license = '2군';
    next();
  }
  else if(record.recordCount[0] + record.recordCount[1] + record.recordCount[2] + record.recordCount[3] + record.recordCount[4] >= 20) {
    record.license = '3군';
    next();
  }
  else if(record.recordCount[0] + record.recordCount[1] + record.recordCount[2] + record.recordCount[3] + record.recordCount[4] + record.recordCount[5] >= 20) {
    record.license = '4군';
    next();
  }
  else {
    record.license = '일반';
    next();
  }

  // if (record.recordCount[0] >= 20) {
  //   record.license = '강주력';
  //   next();
  // } else if (record.recordCount[0] >= 15 || record.recordCount[1] >= 15) {
  //   if (record.recordCount[0] >= record.recordCount[1]) {
  //     record.license = '강주력';
  //     next();
  //   } else {
  //     record.license = '주력';
  //     next();
  //   }
  // } else if (record.recordCount[0] >= 10) {
  //   record.license = '주력';
  //   next();
  // } else {
  //   if (record.recordCount[0]+record.recordCount[1] >= 20) {
  //     record.license = '주력';
  //     next();
  //   } else if (record.recordCount[0]+record.recordCount[1] >= 15 || record.recordCount[2] >= 15) {
  //     if (record.recordCount[0]+record.recordCount[1] >= record.recordCount[2]) {
  //       record.license = '주력';
  //       next();
  //     } else {
  //       record.license = '1군';
  //       next();
  //     }
  //   } else if (record.recordCount[0]+record.recordCount[1] >= 10) {
  //     record.license = '1군';
  //     next();
  //   } else {
  //     if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2] >= 20) {
  //       record.license = '1군';
  //       next();
  //     } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2] >= 15 || record.recordCount[3] >= 15) {
  //       if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2] >= record.recordCount[3]) {
  //         record.license = '1군';
  //         next();
  //       } else {
  //         record.license = '2군';
  //         next();
  //       }
  //     } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2] >= 10) {
  //       record.license = '2군';
  //       next();
  //     } else {
  //       if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3] >= 20) {
  //         record.license = '2군';
  //         next();
  //       } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3] >= 15 || record.recordCount[4] >= 15) {
  //         if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3] >= record.recordCount[4]) {
  //           record.license = '2군';
  //           next();
  //         } else {
  //           record.license = '3군';
  //           next();
  //         }
  //       } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3] >= 10) {
  //         record.license = '3군';
  //         next();
  //       } else {
  //         if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4] >= 20) {
  //           record.license = '3군';
  //           next();
  //         } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4] >= 15 || record.recordCount[5] >= 15) {
  //           if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4] >= record.recordCount[5]) {
  //             record.license = '3군';
  //             next();
  //           } else {
  //             record.license = '4군';
  //             next();
  //           }
  //         } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4] >= 10) {
  //           record.license = '4군';
  //           next();
  //         } else {
  //           if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4]+record.recordCount[5] >= 20) {
  //             record.license = '4군';
  //             next();
  //           } else if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4]+record.recordCount[5] >= 15 || record.recordCount[6] >= 15) {
  //             if (record.recordCount[0]+record.recordCount[1]+record.recordCount[2]+record.recordCount[3]+record.recordCount[4]+record.recordCount[5] >= record.recordCount[6]) {
  //               record.license = '4군';
  //               next();
  //             } else {
  //               record.license = '일반';
  //               next();
  //             }
  //           } else {
  //             record.license = '일반';
  //             next();
  //           }    
  //         }    
  //       }    
  //     }
  //   }
  // }
})

const Record = mongoose.model('Record', recordSchema);

module.exports = Record;