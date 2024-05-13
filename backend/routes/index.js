const express = require('express');
const clickDataController = require('../controllers/clickDataController');

const router = express.Router();

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('clickData', (data) => {
      console.log('Received click data:', data);
      const req = socket.request; // Get the request object from the socket
      clickDataController.saveClickData(data, req);
    });
  });

  return router;
};