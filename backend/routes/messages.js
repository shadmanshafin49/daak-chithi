const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Message = require('../models/Message');

// ✅ GET messages by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const messages = await Message.find({ to: user._id }).sort({ timestamp: -1 });
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PATCH to mark message as read
router.patch('/:id/read', async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!message) return res.status(404).json({ message: 'Message not found' });

    res.status(200).json({ message: 'Marked as read', data: message });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
