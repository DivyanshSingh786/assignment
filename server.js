// The /update-timings API allows the host user to update their available timings, the /view-timings API allows other users to view the available timings, and the /schedule-meeting API allows other users to schedule a meeting based on the available timings.

const express = require('express');
const mongoose = require('mongoose');
const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/meeting-scheduler', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  availability: {
    type: Boolean,
    required: true
  }
});

const Availability = mongoose.model('Availability', availabilitySchema);

// Update available timings API
app.put('/update-timings', async (req, res) => {
  try {
    const { day, time, availability } = req.body;
    const availabilityExists = await Availability.findOne({ day, time });
    if (!availabilityExists) {
      return res.status(400).json({
        success: false,
        message: "Invalid day or time"
      });
    }
    availabilityExists.availability = availability;
    await availabilityExists.save();
    return res.json({
      success: true,
      message: "Timings updated successfully"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// View available timings API
app.get('/view-timings', async (req, res) => {
  try {
    const timings = await Availability.find();
    return res.json({
      success: true,
      message: "Timings retrieved successfully",
      data: timings
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

// Schedule meeting API
app.post('/schedule-meeting', async (req, res) => {
  try {
    const { day, time } = req.body;
    const availability = await Availability.findOne({ day, time });
    if (!availability || !availability.availability) {
      return res.status(400).json({
        success: false,
        message: "Invalid day or time or not available"
      });
    }
    availability.availability = false;
    await availability.save();
    return res.json({
      success: true,
      message: "Meeting scheduled successfully",
      duration: "60 minutes"
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
