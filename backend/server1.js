const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret_admin_jwt_key_2026_x89a';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

const allowedOrigins = [
  'https://king-two-ivory.vercel.app',
  'https://king-fwr9iktwi-ashvik538s-projects.vercel.app',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || origin.startsWith('http://localhost:')) {
      callback(null, true);
    } else {
      callback(null, true); // Allow during development
    }
  },
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/contactdb')
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Message Schema
const messageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, default: '' },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  isStarred: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Admin Auth Middleware
const authAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Invalid or expired token' });
  }
};

// Root status endpoint
app.get('/', (req, res) => {
  res.json({
    status: "Contact & Admin API is running",
    endpoints: {
      public: ['POST /api/contact'],
      admin: [
        'POST /api/admin/login',
        'GET /api/admin/verify',
        'GET /api/admin/stats',
        'GET /api/admin/messages',
        'PATCH /api/admin/messages/:id',
        'DELETE /api/admin/messages/:id',
        'POST /api/admin/messages/bulk-delete',
        'PATCH /api/admin/messages/bulk-mark'
      ]
    }
  });
});

// Public Contact Form Submission
app.post('/api/contact', async (req, res) => {
  try {
    const { fullName, email, phone, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: 'Please fill in all required fields.' });
    }

    const newMessage = new Message({ fullName, email, phone, subject, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ success: false, error: 'Server error. Please try again.' });
  }
});

// Public Legacy Endpoint for fetching messages (kept for backward compatibility)
app.get('/api/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Server error.' });
  }
});

/* ==================== ADMIN API ROUTES ==================== */

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Username and password are required.' });
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username: ADMIN_USERNAME, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({
      success: true,
      message: 'Authentication successful',
      token,
      user: { username: ADMIN_USERNAME, role: 'admin' }
    });
  }

  return res.status(401).json({ success: false, error: 'Invalid username or password.' });
});

// Admin Verify Token
app.get('/api/admin/verify', authAdmin, (req, res) => {
  res.json({ success: true, user: req.admin });
});

// Admin Dashboard Metrics
app.get('/api/admin/stats', authAdmin, async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const unreadMessages = await Message.countDocuments({ isRead: false });
    const starredMessages = await Message.countDocuments({ isStarred: true });
    
    const last24hDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recent24h = await Message.countDocuments({ createdAt: { $gte: last24hDate } });

    res.json({
      success: true,
      stats: {
        totalMessages,
        unreadMessages,
        starredMessages,
        recent24h
      }
    });
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ success: false, error: 'Server error fetching statistics.' });
  }
});

// Admin Fetch Messages (with search & filtering)
app.get('/api/admin/messages', authAdmin, async (req, res) => {
  try {
    const { search, filter } = req.query;
    let query = {};

    if (filter === 'unread') {
      query.isRead = false;
    } else if (filter === 'read') {
      query.isRead = true;
    } else if (filter === 'starred') {
      query.isStarred = true;
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { fullName: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex },
        { phone: searchRegex }
      ];
    }

    const messages = await Message.find(query).sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    console.error('Error fetching admin messages:', err);
    res.status(500).json({ success: false, error: 'Server error fetching messages.' });
  }
});

// Admin Toggle Message Status (Read/Starred)
app.patch('/api/admin/messages/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead, isStarred } = req.body;

    const updates = {};
    if (typeof isRead === 'boolean') updates.isRead = isRead;
    if (typeof isStarred === 'boolean') updates.isStarred = isStarred;

    const updatedMessage = await Message.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({ success: true, data: updatedMessage });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ success: false, error: 'Server error updating message.' });
  }
});

// Admin Single Delete Message
app.delete('/api/admin/messages/:id', authAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ success: false, error: 'Message not found.' });
    }

    res.json({ success: true, message: 'Message deleted successfully.' });
  } catch (err) {
    console.error('Error deleting message:', err);
    res.status(500).json({ success: false, error: 'Server error deleting message.' });
  }
});

// Admin Bulk Delete Messages
app.post('/api/admin/messages/bulk-delete', authAdmin, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ success: false, error: 'No message IDs provided for bulk delete.' });
    }

    await Message.deleteMany({ _id: { $in: ids } });
    res.json({ success: true, message: `${ids.length} messages deleted successfully.` });
  } catch (err) {
    console.error('Error bulk deleting messages:', err);
    res.status(500).json({ success: false, error: 'Server error during bulk delete.' });
  }
});

// Admin Bulk Mark Read/Unread
app.patch('/api/admin/messages/bulk-mark', authAdmin, async (req, res) => {
  try {
    const { ids, isRead } = req.body;
    if (!Array.isArray(ids) || ids.length === 0 || typeof isRead !== 'boolean') {
      return res.status(400).json({ success: false, error: 'Invalid parameters for bulk mark.' });
    }

    await Message.updateMany({ _id: { $in: ids } }, { $set: { isRead } });
    res.json({ success: true, message: `${ids.length} messages updated successfully.` });
  } catch (err) {
    console.error('Error bulk updating messages:', err);
    res.status(500).json({ success: false, error: 'Server error during bulk update.' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
