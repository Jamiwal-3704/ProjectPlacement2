const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bfhl_db';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Mongoose Schema and Model
const dataSchema = new mongoose.Schema({
  user_id: String,
  email: String,
  roll_number: String,
  numbers: [String],
  alphabets: [String],
  highest_alphabet: [String],
});

const Data = mongoose.model('Data', dataSchema);

// POST Endpoint
app.post('/bfhl', async (req, res) => {
  try {
    const { data } = req.body;

    // Validate input
    if (!Array.isArray(data)) {
      throw new Error('Invalid input: data must be an array');
    }

    // Separate numbers and alphabets
    const numbers = data.filter((item) => !isNaN(item));
    const alphabets = data.filter((item) => /^[A-Za-z]$/.test(item));

    // Find the highest alphabet (case insensitive)
    const highest_alphabet = alphabets.length > 0
      ? [alphabets.reduce((a, b) => a.toLowerCase() > b.toLowerCase() ? a : b)]
      : [];

    // Create response
    const response = {
      is_success: true,
      user_id: 'john_doe_17091999', // Replace with your user ID
      email: 'john@xyz.com', // Replace with your email
      roll_number: 'ABCD123', // Replace with your roll number
      numbers,
      alphabets,
      highest_alphabet,
    };

    // Save to MongoDB
    const newData = new Data(response);
    await newData.save();

    // Send response
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ is_success: false, error: error.message });
  }
});

// GET Endpoint
app.get('/bfhl', (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

// Start the server
const PORT = process.env.PORT || 5000; // Changed to port 5000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});