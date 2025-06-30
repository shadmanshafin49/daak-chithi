require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Serve static files from /assets
app.use('/assets', express.static(__dirname + '/../assets'));

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const publicRoute = require('./routes/public');
const messagesRoute = require('./routes/messages');
const authRoute = require('./routes/auth');

app.use('/api/auth', authRoute);
app.use('/api/messages', messagesRoute);
app.use('/', publicRoute); // This must come last

// ✅ Test Routes
app.get('/', (req, res) => {
  res.send('Root route is alive!');
});

app.get('/test', (req, res) => {
  res.send('Test route working!');
});
