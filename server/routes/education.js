const express = require('express');
const router = express.Router();
const { getGlossary, getTermByName } = require('../controllers/educationController');

router.get('/glossary', getGlossary);
router.get('/glossary/:term', getTermByName);

module.exports = router;