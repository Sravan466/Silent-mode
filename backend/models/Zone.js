const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  radius: {
    type: Number,
    required: true,
    min: 10,
    max: 5000
  },
  mode: {
    type: String,
    enum: ['silent', 'vibrate'],
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

zoneSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Zone', zoneSchema);