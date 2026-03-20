const { validationResult } = require('express-validator');
const { computeHealthScore } = require('../services/healthService');
const HealthRecord = require('../models/HealthRecord');

/**
 * POST /api/health-score
 * Accepts health metrics, returns score + recommendations.
 */
const calculateHealthScore = async (req, res, next) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { steps, sleep_hours, heart_rate, calories, water_intake } = req.body;

    const result = computeHealthScore({ steps, sleep_hours, heart_rate, calories, water_intake });

    // Persist to MongoDB if connected
    try {
      const record = await HealthRecord.create({
        input:  { steps, sleep_hours, heart_rate, calories, water_intake },
        result,
      });
      result._id = record._id;
    } catch (_) {
      // DB not available — silently skip, API still responds
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { calculateHealthScore };
