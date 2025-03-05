const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: String, required: true },
  content: { type: String, required: true },
  subject: {
    type: String,
    required: true, // Make subject mandatory
    trim: true,
},

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Message', messageSchema);
