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
    strict: false, // Allow additional fields not defined in the schema
  }
);

const Event = mongoose.model("Event", EventSchema);
module.exports = Event;
