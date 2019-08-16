const express = require('express');

const router = express.Router();

const { createToken, validateToken, invalidateToken, getTokens} = require('./controllers/tokenController');

const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy;
const mockBearer = require('../bearer');

passport.use(new Strategy(
  (token, cb) => {
    mockBearer.findByToken(token, (err, user) => {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
  }));

//Endpoint 1: Create invite Token
router.post('/token', passport.authenticate('bearer', { session: false }), createToken);

//Endpoint 2: Validate invite Token
router.get('/token/:token', validateToken);

//Endpoint 3: Disable invite Token
router.put('/token/:token', passport.authenticate('bearer', { session: false }), invalidateToken);

//Endpoint 4: Get all invite Token
router.get('/tokens', passport.authenticate('bearer', { session: false }), getTokens);

module.exports = router;