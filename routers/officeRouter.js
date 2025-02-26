const express = require('express');
const officeController = require('../controllers/officeController');

const router = express.Router();

router
  .route('/')
  .get(officeController.getAllOffices)
  .post(officeController.createOffice);

router
  .route('/:id')
  .get(officeController.getSingleOffice)
  .patch(officeController.updateOffice)
  .delete(officeController.deleteOffice);

module.exports = router;
