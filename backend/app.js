const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const dbName = 'testing';

// Enable CORS for all origins
app.use(cors());

// Serve the frontend files
app.use(express.static('path/to/frontend/directory'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/testing', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB schema
const clickDataSchema = new mongoose.Schema({
  tag: String,
  text: String,
  id: String,
  class: String,
  headers: Object,
  localStorageData: Object
});

// Create MongoDB model
const ClickData = mongoose.model('ClickData', clickDataSchema);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log('A user connected');

  // Event listener for clickData event
  socket.on('clickData', async (data) => {
    console.log('Received click data:', data);

    // Save data to MongoDB
    try {
      const savedData = await ClickData.create(data);
      console.log('Data saved to MongoDB:', savedData);
    } catch (error) {
      console.error('Failed to insert data into MongoDB:', error);
    }
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
