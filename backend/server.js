const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const Event = require("./models/events.model");
const SubEvent = require("./models/subevents.model");
const PollResponse = require("./models/pollResponse.model");
const ParticipantModelCache = require("./models/participantModelCache.model");

const cors = require("cors");
const generateParticipantSchema = require("./models/participantSchema");
const {
  generateCertificatePDF,
  generateIDPDF,
} = require("./certificate-gen/generatecertificate");

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// MongoDB Atlas connection string
const mongoURI = "mongodb://localhost:27017/event_management";

// Cache to store compiled participant models
const participantModels = {};

app.get("/events", async (req, res) => {
  try {
    const events = await Event.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Server-side code (e.g., server.js)
app.get("/events/:eventId", (req, res) => {
  const { eventId } = req.params;
  console.log("Event ID:", eventId);
  // Check if the event exists in the event table
  Event.findById(eventId)
    .then((event) => {
      if (event) {
        res.json({ event });
      } else {
        res.status(404).json({ error: "Event not found" });
      }
    })
    .catch((error) => {
      console.error("Error checking event existence:", error);
      res.status(500).json({ error: "Internal server error" });
    });
});

app.get("/events/:eventId/participants", async (req, res) => {
  try {
    const { eventId } = req.params;
    console.log("Fetching participants for eventId:", eventId);
    console.log("Participant models:", participantModels);

    const ParticipantModel = participantModels[`Participant_${eventId}`];
    if (ParticipantModel) {
      const participants = await ParticipantModel.find();
      console.log("Fetched participants:", participants);
      res.json(participants);
    } else {
      console.log("Participant model not found for eventId:", eventId);
      res.status(404).json({ error: "Participant model not found" });
    }
  } catch (error) {
    console.error("Error fetching participants:", error);
    res.status(500).json({ error: "Error fetching participants" });
  }
});

// Endpoint to fetch poll questions for a specific event
app.get("/events/:eventId/pollquestions", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    const pollQuestions = event.eventpollquestions;

    res.status(200).json({ pollQuestions });
  } catch (error) {
    console.error("Error fetching poll questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Endpoint to fetch feedback questions for a specific event
app.get("/events/:eventId/feedbackquestions", async (req, res) => {
  try {
    console.log("tryna fetch feedback ques1");
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);
    console.log("tryna fetch feedback ques2");

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    console.log("tryna fetch feedback ques3");
    const feedbackQuestions = event.eventfeedbackquestions;
    console.log("tryna fetch feedback ques4");
    console.log(feedbackQuestions);
    res.status(200).json({ feedbackQuestions });
  } catch (error) {
    console.error("Error fetching feedback questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//endpoint to retrieve poll responses for an event// server.js
app.get("/events/:eventId/pollresponses", async (req, res) => {
  try {
    const eventId = req.params.eventId;

    // Find all poll responses for the given event ID
    const pollResponses = await PollResponse.find({ eventId });

    res.status(200).json({ pollResponses });
  } catch (error) {
    console.error("Error retrieving poll responses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/createevents", async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(200).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.post("/createsubevents", async (req, res) => {
  try {
    const event = await SubEvent.create(req.body);
    res.status(200).json({ event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

async function loadParticipantModelsFromCache() {
  const cachedModels = await ParticipantModelCache.find();
  cachedModels.forEach((model) => {
    const participantSchema = generateParticipantSchema(model.fields);
    const ParticipantModel = mongoose.model(model.modelName, participantSchema);
    participantModels[model.modelName] = ParticipantModel;
  });
}

// server.js
// server.js
app.post("/createParticipantModel", async (req, res) => {
  const { eventId, registrationFields } = req.body;

  try {
    // Check if the participant model already exists in the cache
    let ParticipantModel = participantModels[`Participant_${eventId}`];

    if (!ParticipantModel) {
      // Create and compile the participant model if it doesn't exist
      const participantSchema = generateParticipantSchema(registrationFields);
      ParticipantModel = mongoose.model(
        `Participant_${eventId}`,
        participantSchema
      );
      participantModels[`Participant_${eventId}`] = ParticipantModel;

      // Save the participant fields to the cache collection
      const cacheModel = new ParticipantModelCache({
        modelName: `Participant_${eventId}`,
        fields: registrationFields,
      });
      await cacheModel.save();
    }

    res.status(200).json({ message: "Participant model created successfully" });
  } catch (error) {
    console.error("Error creating participant model:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/registerParticipant", async (req, res) => {
  const { eventId, registrationFields, participantData } = req.body;

  try {
    // Check if the participant model already exists in the cache
    let ParticipantModel = participantModels[`Participant_${eventId}`];

    if (!ParticipantModel) {
      // Create and compile the participant model if it doesn't exist
      const participantSchema = generateParticipantSchema(
        registrationFields,
        eventId
      );
      ParticipantModel = mongoose.model(
        `Participant_${eventId}`,
        participantSchema
      );
      participantModels[`Participant_${eventId}`] = ParticipantModel; // Store the compiled model in the cache
    }

    const createdParticipant = await ParticipantModel.create(participantData);
    res.status(200).json({ participant: createdParticipant });
  } catch (error) {
    console.error("Error registering participant:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/events/:eventId/pollresponses", async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const { participantId, responses } = req.body;

    // Validate the incoming data
    if (!eventId || !participantId || !responses || !Array.isArray(responses)) {
      return res.status(400).json({ error: "Invalid request data" });
    }

    const pollResponse = new PollResponse({
      eventId,
      participantId,
      responses,
    });

    await pollResponse.save();

    res.status(200).json({ message: "Poll responses submitted successfully" });
  } catch (error) {
    console.error("Error submitting poll responses:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/generatecertificate", async (req, res) => {
  try {
    console.log("hiii");
    console.log(req.body);
    const { Name } = req.body; // Extract name from request body
    const url = await generateCertificatePDF(Name); // Use the name to generate the certificate
    console.log(url);
    res.status(200).json({ message: "PDFs generated successfully", url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to generate PDFs" });
  }
});

app.post("/generateID", async (req, res) => {
  try {
    const { Name } = req.body; // Extract name from request body
    const url = await generateIDPDF(Name);
    res.status(200).json({ message: "PDFs generated successfully", url });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to generate PDFs" });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    // Verify the password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const jwtsecret = "MySecretKEy";
    // If email and password are correct, generate JWT token
    const token = jwt.sign({ userId: user._id }, jwtsecret, {
      expiresIn: "1h", // Token expires in 1 hour
    });
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const newUser = new User({ email, password });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("MongoDB connected");

    // Load participant models from the cache collection
    await loadParticipantModelsFromCache();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error(err));
