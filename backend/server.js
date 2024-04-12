const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/events.model");
const SubEvent = require("./models/subevents.model");
const cors = require("cors");

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// MongoDB Atlas connection string
const mongoURI = "mongodb://localhost:27017/event_management";

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

// Connect to MongoDB Atlas
mongoose
  .connect(mongoURI)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    console.log("MongoDB connected");
  })
  .catch((err) => console.error(err));
