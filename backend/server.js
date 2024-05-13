const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const mongoose = require('./config/mongoose');
const routes = require('./routes');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);


app.use(cors());


app.use(express.static(path.join(__dirname, 'public')));


app.use('/api', routes(io));

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});