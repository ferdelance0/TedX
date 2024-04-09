const mongoose = require("mongoose");

const SubEventSchema = new mongoose.Schema(
  {
    subeventname: {
      type: String,
      required: true,
    },

    subeventdescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const SubEvent = mongoose.model("SubEvent", SubEventSchema);
module.exports = SubEvent;
