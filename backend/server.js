require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors());
app.use(express.json()); // parse JSON requests

// Serve static files from public directory
app.use(express.static('public'));

// MongoDB connection string from environment or fallback
const CONNECTION_STRING = process.env.MONGODB_URI || "mongodb+srv://kirithika:prathu@cluster0.wvtthjq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// MongoDB connection handlers
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠ Mongoose disconnected from MongoDB Atlas');
});

mongoose
  .connect(CONNECTION_STRING, {
    dbName: "eduerp",
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("✅ MongoDB Atlas Connection Successful"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// Import routes from './routes/'
const authRoutes = require('./routes/auth');
const registrationsRoutes = require('./routes/registrations');
const eventsRoutes = require('./routes/events');

// Root route - return API info
app.get('/', (req, res) => {
  res.json({
    message: 'Smart Curriculum Activity & Attendance API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      registrations: '/api/registrations',
      events: '/api/events',
    }
  });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationsRoutes);
app.use('/api/events', eventsRoutes);

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Make io accessible in routes if needed
app.set('io', io);

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
