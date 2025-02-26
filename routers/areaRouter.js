const express = require('express');
const areaController = require('../controllers/areaController');

const router = express.Router();

router
  .route('/')
  .get(areaController.getAllAreas)
  .post(areaController.createArea);

router
  .route('/:id')
  .get(areaController.getSingleArea)
  .patch(areaController.updateArea)
  .delete(areaController.deleteArea);

module.exports = router;
