const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema(
  {
    input: {
      steps:       { type: Number, required: true },
      sleep_hours: { type: Number, required: true },
      heart_rate:  { type: Number, required: true },
      calories:    { type: Number, required: true },
      water_intake:{ type: Number, required: true },
    },
    result: {
      health_score:    { type: Number, required: true },
      category:        { type: String, required: true },
      recommendations: [String],
      breakdown: {
        steps:       Number,
        sleep:       Number,
        heart_rate:  Number,
        calories:    Number,
        water:       Number,
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
