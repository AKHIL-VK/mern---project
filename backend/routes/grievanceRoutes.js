const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const grievanceController = require('../controllers/grievanceController');

router.post('/', auth, grievanceController.submitGrievance);
router.get('/', auth, grievanceController.getGrievances);
router.get('/search', auth, grievanceController.searchGrievances);
router.get('/:id', auth, grievanceController.getGrievanceById);
router.put('/:id', auth, grievanceController.updateGrievance);
router.delete('/:id', auth, grievanceController.deleteGrievance);

module.exports = router;
