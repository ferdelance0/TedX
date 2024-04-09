const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },

    eventDescription: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Corrected 'timestamps' spelling
);

const Event = mongoose.model('Event', EventSchema);

module.exports = Event;
