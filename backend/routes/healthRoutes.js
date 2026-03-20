const express = require('express');
const { body } = require('express-validator');
const { calculateHealthScore } = require('../controllers/healthController');

const router = express.Router();

const validate = [
  body('steps')
    .isInt({ min: 0, max: 100000 })
    .withMessage('steps must be an integer between 0 and 100,000'),
  body('sleep_hours')
    .isFloat({ min: 0, max: 24 })
    .withMessage('sleep_hours must be a number between 0 and 24'),
  body('heart_rate')
    .isInt({ min: 20, max: 250 })
    .withMessage('heart_rate must be an integer between 20 and 250'),
  body('calories')
    .isInt({ min: 0, max: 10000 })
    .withMessage('calories must be an integer between 0 and 10,000'),
  body('water_intake')
    .isFloat({ min: 0, max: 20 })
    .withMessage('water_intake must be a number between 0 and 20 litres'),
];

router.post('/', validate, calculateHealthScore);

module.exports = router;
