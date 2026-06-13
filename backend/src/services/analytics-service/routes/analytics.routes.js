const express = require('express');
const controller = require('../controllers/analytics.controller');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');
const roleMiddleware = require('../../../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware, roleMiddleware('ADMIN'));

router.get('/', controller.dashboard);

module.exports = router;
