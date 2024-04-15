const mongoose = require('mongoose');

const pollResponseSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },

    responses: {
      type: [Number],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PollResponse = mongoose.model('PollResponse', pollResponseSchema);

module.exports = PollResponse;
