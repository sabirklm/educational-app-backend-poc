const express = require('express');
const questionController = require('../controllers/QuestionController');

const router = express.Router();

// Search route (must be before /:id)
router.get('/search', questionController.search);

// Filter routes
router.get('/type/:type', questionController.getByType);
router.get('/tags/:tags', questionController.getByTags);

// CRUD routes
router.get('/', questionController.getAll);
router.get('/:id', questionController.getById);
router.post('/', questionController.create);
router.put('/:id', questionController.update);
router.delete('/:id', questionController.delete);

module.exports = router;