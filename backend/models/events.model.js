// event.model.js
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
    },
    eventdescription: {
      type: String,
    },
  },
  {
    timestamps: true,
    strict: false,
  }
);

module.exports = mongoose.model("Event", EventSchema);
