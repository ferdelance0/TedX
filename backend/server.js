const express = require("express");
const mongoose = require("mongoose");
const Event = require("./models/events.model");
const SubEvent = require("./models/subevents.model");

// Create Express app
const app = express();
app.use(express.json());

// MongoDB Atlas connection string
const mongoURI = "mongodb://localhost:27017/event_management";

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
