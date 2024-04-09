const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    eventname: {
      type: String,
      required: true,
    },

    eventdescription: {
      type: String,
      required: true,
    },
  },
  { timesstamps: true }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
