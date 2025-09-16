const mongoose = require('mongoose');
const crypto = require('crypto');

const GiftCardHistorySchema = new mongoose.Schema({
  type: { type: String, enum: ['purchase', 'redemption'], required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const GiftCardSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
    minlength: 16
  },
  initialBalance: { type: Number, required: true },
  remainingBalance: { type: Number, required: true },
  expiryDate: { type: Date },
  isActive: { type: Boolean, default: true },
  history: [GiftCardHistorySchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Secure code generator
GiftCardSchema.statics.generateCode = function(length = 20) {
  return crypto.randomBytes(length).toString('hex');
};

// Check validity and balance
GiftCardSchema.methods.isValid = function() {
  if (!this.isActive) return false;
  if (this.expiryDate && this.expiryDate < new Date()) return false;
  if (this.remainingBalance <= 0) return false;
  return true;
};

module.exports = mongoose.model('GiftCard', GiftCardSchema);
