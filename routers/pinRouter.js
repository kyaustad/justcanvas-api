const express = require('express');
const pinController = require('../controllers/pinController');

const router = express.Router();

router.route('/').get(pinController.getAllPins).post(pinController.createPin);

router
  .route('/:id')
  .get(pinController.getSinglePin)
  .patch(pinController.updatePin)
  .delete(pinController.deletePin);

module.exports = router;
