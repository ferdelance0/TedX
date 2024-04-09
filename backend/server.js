const express = require('express');
const mongoose = require('mongoose');
const Event = require('./models/events.model');
const SubEvent = require('./models/subevents.model');
const cors = require('cors');

// Create Express app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
// MongoDB Atlas connection string
const mongoURI = 'mongodb://localhost:27017/event_management';

app.get('/createevents', async (req, res) => {
  try {
    console.log('haaiiiii');
  } catch (error) {
    console.log(error);
  }
});

app.post('/createevents', async (req, res) => {
  try {
    console.log('haaiiiii');
    console.log(req.body);
    const event = await Event.create(req.body);
    console.log(event);
    res.status(200).json({ event });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: error.message });
  }
});

app.post('/createsubevents', async (req, res) => {
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
    console.log('MongoDB connected');
  })
  .catch((err) => console.error(err));
