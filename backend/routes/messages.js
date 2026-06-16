const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const auth = require('../middleware/auth');

// ✅ GET the authenticated user's own messages (no username in the URL).
router.get('/', auth, async (req, res) => {
  try {
    const messages = await Message.find({ to: req.userId }).sort({ timestamp: -1 });
    res.json({ messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PATCH to mark a message as read — only if it belongs to the authed user.
router.patch('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findOne({ _id: req.params.id, to: req.userId });
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.read = true;
    await message.save();

    res.status(200).json({ message: 'Marked as read', data: message });
  } catch (err) {
    console.error('Error updating message:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
