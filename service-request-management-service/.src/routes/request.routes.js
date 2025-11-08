const express = require('express');
const router = express.Router();
const requestController = require('../controller/request.controller.js');

// [INSTRUCTION_B]
// Import the new middleware
// [INSTRUCTION_E]
const authMiddleware = require('../middleware/auth.middleware');

/**
 * Base route: /api/requests
 *
 * All routes under this path will first pass through
 * the 'extractUserInfo' middleware to get user info from headers.
 */
router.use(authMiddleware.extractUserInfo);

// POST /api/requests - Create a new request
router.post('/', requestController.createRequest);

// GET /api/requests - Get all requests (logic now depends on user role)
router.get('/', requestController.getAllRequests);

// GET /api/requests/:id - Get a single request by its ID (UUID)
router.get('/:id', requestController.getRequestById);

// PUT /api/requests/:id - Update a request
router.put('/:id', requestController.updateRequest);

// DELETE /api/requests/:id - Delete a request
router.delete('/:id', requestController.deleteRequest);

router.get('/by-sender/:senderId', requestController.getRequestsBySenderId);

module.exports = router;