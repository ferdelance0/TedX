const mongoose = require('mongoose');

const SubEventSchema = new mongoose.Schema(
  {
    subeventname: {
      type: String,
    },

    subeventdescription: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields not defined in the schema
  }
);
const SubEvent = mongoose.model('SubEvent', SubEventSchema);
module.exports = SubEvent;
