const HealthRecord = require('../models/HealthRecord');

/**
 * GET /api/records
 * Returns last 20 health records (newest first).
 */
const getRecords = async (req, res, next) => {
  try {
    const records = await HealthRecord.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    res.json(records);
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/records/:id
 * Deletes a single record.
 */
const deleteRecord = async (req, res, next) => {
  try {
    await HealthRecord.findByIdAndDelete(req.params.id);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getRecords, deleteRecord };
