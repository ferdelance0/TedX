const mongoose = require("mongoose");

const generateParticipantSchema = (fields, eventId) => {
  const schemaFields = {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    idCardUrl: {
      type: String,
    },
    certificateUrl: {
      type: String,
    },
    status: {
      type: String,
      default: "Registered",
    },
    ID: {type: String},
    subevents: [
      {
        subeventId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubEvent",
        },
        subeventName: String,
      },
    ],
    pollResponses: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Event.eventpollquestions",
        },
        answer: String,
      },
    ],
  };

  fields.forEach((field) => {
    schemaFields[field.label] = {
      type: getMongooseType(field.inputType),
      required: true,
    };
  });

  return new mongoose.Schema(schemaFields);
};

const getMongooseType = (inputType) => {
  switch (inputType) {
    case "text":
    case "email":
      return String;
    case "number":
      return Number;
    case "date":
      return Date;
    // Add more cases for other input types as needed
    default:
      return String;
  }
};

module.exports = generateParticipantSchema;
