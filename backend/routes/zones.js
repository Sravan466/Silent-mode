const express = require('express');
const Zone = require('../models/Zone');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.post('/', async (req, res) => {
  try {
    const { name, latitude, longitude, radius, mode } = req.body;
    
    const zone = new Zone({
      userId: req.user._id,
      name,
      location: {
        type: 'Point',
        coordinates: [longitude, latitude]
      },
      radius,
      mode
    });

    await zone.save();
    res.status(201).json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const zones = await Zone.find({ userId: req.user._id });
    res.json(zones);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, latitude, longitude, radius, mode, isActive } = req.body;
    
    const zone = await Zone.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      {
        name,
        location: {
          type: 'Point',
          coordinates: [longitude, latitude]
        },
        radius,
        mode,
        isActive
      },
      { new: true }
    );

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json(zone);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const zone = await Zone.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!zone) {
      return res.status(404).json({ message: 'Zone not found' });
    }

    res.json({ message: 'Zone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;