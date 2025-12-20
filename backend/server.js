const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../frontend')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleString()} - ${req.method} ${req.path}`);
  next();
});

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

console.log('Attempting to connect to MongoDB...');
console.log('Connection URI:', MONGODB_URI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials in logs

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
})
.then(() => {
  console.log('✓ MongoDB Connected Successfully!');
  console.log('Database:', mongoose.connection.db.databaseName);
  console.log('Connection state:', mongoose.connection.readyState);
})
.catch(err => {
  console.error('✗ MongoDB connection error:', err.message);
  console.error('\n=== MongoDB Connection Troubleshooting ===');
  console.error('1. Make sure MongoDB is installed and running');
  console.error('2. For local MongoDB, start it with: mongod');
  console.error('3. Or use MongoDB Atlas and set MONGODB_URI in .env file');
  console.error('4. Check your .env file for correct MONGODB_URI');
  console.error('==========================================\n');
});

// MongoDB connection event handlers
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.warn('Mongoose disconnected from MongoDB');
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Contact Schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// Test endpoint to check database connection
app.get('/api/test-db', async (req, res) => {
  try {
    const count = await Contact.countDocuments();
    res.json({ 
      status: 'Database connected',
      messageCount: count,
      collection: 'contacts'
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database error',
      error: error.message 
    });
  }
});

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    console.log('Received contact form submission');
    console.log('Request body:', req.body);
    
    const { name, email, subject, message } = req.body;
    
    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.log('Validation failed: Missing required fields');
      return res.status(400).json({ 
        error: 'All fields are required',
        received: { name: !!name, email: !!email, subject: !!subject, message: !!message }
      });
    }

    // Trim whitespace
    const trimmedData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    };

    // Check if trimmed values are empty
    if (!trimmedData.name || !trimmedData.email || !trimmedData.subject || !trimmedData.message) {
      console.log('Validation failed: Empty fields after trimming');
      return res.status(400).json({ error: 'All fields must contain non-whitespace characters' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedData.email)) {
      console.log('Validation failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format' });
    }

    console.log('Creating contact with data:', trimmedData);

    // Check MongoDB connection
    const connectionState = mongoose.connection.readyState;
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    
    if (connectionState !== 1) {
      const stateMessages = {
        0: 'Disconnected - MongoDB is not connected',
        2: 'Connecting - MongoDB is still connecting, please wait',
        3: 'Disconnecting - MongoDB is disconnecting'
      };
      
      console.error('MongoDB not ready. Connection state:', connectionState, stateMessages[connectionState] || 'Unknown');
      
      return res.status(503).json({ 
        error: 'Database connection not available. Please try again later.',
        details: stateMessages[connectionState] || `Connection state: ${connectionState}`,
        troubleshooting: 'Please check: 1) MongoDB is running, 2) Connection string is correct, 3) Server console for connection errors'
      });
    }

    // Create and save contact
    const newContact = new Contact(trimmedData);
    console.log('Saving contact to database...');
    
    const savedContact = await newContact.save();
    
    console.log('Contact saved successfully!');
    console.log('Saved contact ID:', savedContact._id);
    console.log('Saved contact:', JSON.stringify(savedContact, null, 2));
    
    res.status(201).json({ 
      message: 'Contact form submitted successfully', 
      data: savedContact 
    });
  } catch (error) {
    console.error('Error saving contact:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key errors or validation errors
    if (error.name === 'ValidationError') {
      console.log('Mongoose validation error');
      return res.status(400).json({ 
        error: 'Validation error: ' + error.message,
        details: error.errors 
      });
    }
    
    if (error.name === 'MongoServerError' || error.name === 'MongoError') {
      console.log('MongoDB error');
      return res.status(500).json({ 
        error: 'Database error: ' + error.message 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to submit contact form. Please try again later.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all messages
app.get('/api/messages', async (req, res) => {
  try {
    console.log('Fetching messages from database...');
    const messages = await Contact.find().sort({ createdAt: -1 });
    console.log(`Fetched ${messages.length} messages from database`);
    console.log('Messages:', JSON.stringify(messages, null, 2));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ 
      error: 'Failed to fetch messages',
      details: error.message 
    });
  }
});

// Get single message by ID
app.get('/api/messages/:id', async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json(message);
  } catch (error) {
    console.error('Error fetching message:', error);
    res.status(500).json({ error: 'Failed to fetch message' });
  }
});

// Delete message
app.delete('/api/messages/:id', async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Serve index.html for root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Serve messages.html
app.get('/messages.html', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/messages.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n========================================`);
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Frontend available at http://localhost:${PORT}`);
  console.log(`========================================\n`);
  
  // Check MongoDB connection status after a short delay
  setTimeout(() => {
    const dbState = mongoose.connection.readyState;
    const stateNames = { 0: 'Disconnected', 1: 'Connected', 2: 'Connecting', 3: 'Disconnecting' };
    
    if (dbState === 1) {
      console.log('✅ MongoDB: Connected');
    } else {
      console.log(`⚠️  MongoDB: ${stateNames[dbState] || 'Unknown'} (State: ${dbState})`);
      console.log('   Please check MongoDB connection and restart server if needed');
      console.log('   See MONGODB_SETUP.md for setup instructions\n');
    }
  }, 2000);
});

