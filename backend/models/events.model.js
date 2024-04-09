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
  { timestamps: true } // Corrected 'timestamps' spelling
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
