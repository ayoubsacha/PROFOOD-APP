const express = require('express');
const authMiddleware = require('../../../middleware/authMiddleware');
const activeAccountMiddleware = require('../../../middleware/activeAccountMiddleware');

const router = express.Router();

router.use(authMiddleware, activeAccountMiddleware);

router.all('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Assistant/RAG microservice is not implemented yet',
    data: {
      readyForProxy: true,
      forwardedUserContext: req.forwardedAuthContext,
      expectedFutureTarget: process.env.RAG_SERVICE_URL || null,
    },
  });
});

module.exports = router;
