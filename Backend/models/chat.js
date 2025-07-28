const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const chatSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sessionId: { type: String, required: true },
  messages: [messageSchema],
  createdAt: { type: Date, default: Date.now }
});

chatSchema.index({ userId: 1, sessionId: 1 });

module.exports = mongoose.model('Chat', chatSchema);