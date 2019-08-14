const express = require('express');

const router = express.Router();

const { createToken, validateToken, invalidateToken, getTokens} = require('./controllers/tokenController');

//Endpoint 1: Create invite Token
router.post('/token', createToken);

//Endpoint 2: Validate invite Token
router.get('/token/:token', validateToken);

//Endpoint 3: Disable invite Token
router.put('/token/:token', invalidateToken);

//Endpoint 4: Get all invite Token
router.get('/tokens', getTokens)

module.exports = router;