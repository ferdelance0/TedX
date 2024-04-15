// models/participantModelCache.model.js
const mongoose = require("mongoose");

const participantModelCacheSchema = new mongoose.Schema({
  modelName: {
    type: String,
    required: true,
    unique: true,
  },
  fields: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model(
  "ParticipantModelCache",
  participantModelCacheSchema
);
