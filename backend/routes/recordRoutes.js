const express = require('express');
const { getRecords, deleteRecord } = require('../controllers/recordController');

const router = express.Router();

router.get('/',      getRecords);
router.delete('/:id', deleteRecord);

module.exports = router;
