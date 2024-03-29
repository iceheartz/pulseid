const tokenService = require('../services/tokenService');
const _ = require('lodash');

const createToken = async(req, res) => {
  if(_.get(req, 'user.id', undefined) === undefined) return res.status(401).json({ message: 'Unauthorized Access' });
    try {
      const result = await tokenService.createToken(req.body);
      return res.status(200).json(result);
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
}

const validateToken = async(req, res) => {
    try {
      const result = await tokenService.validateToken(req.params.token)
      return res.status(200).send(result);
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
}

const invalidateToken = async (req, res) => {
  if(_.get(req, 'user.id', undefined) === undefined) return res.status(401).json({ message: 'Unauthorized Access' });
    try {
      const result = await tokenService.invalidateToken(req.params.token);
      return res.status(200).send(result);
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
}

const getTokens =  async (req, res) => {
  if(_.get(req, 'user.id', undefined) === undefined) return res.status(401).json({ message: 'Unauthorized Access' });
    try {
      const result = await tokenService.getTokens();
      return res.status(200).json(result);
    } catch(err) {
      return res.status(400).json({ message: err.message });
    }
}

module.exports = {
  createToken,
  validateToken,
  invalidateToken,
  getTokens
} 