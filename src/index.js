const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const DEFAULT_SECRET = 'change_this_secret';

class AuthSDK {
  constructor(options = {}) {
    this.secret = options.secret || process.env.JWT_SECRET || DEFAULT_SECRET;
    this.users = new Map(); // simple in-memory store
  }

  router() {
    const router = express.Router();
    router.post('/register', this.register.bind(this));
    router.post('/login', this.login.bind(this));
    return router;
  }

  async register(req, res) {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'username and password required' });
    }
    if (this.users.has(username)) {
      return res.status(400).json({ error: 'user already exists' });
    }
    const hash = await bcrypt.hash(password, 10);
    this.users.set(username, { username, password: hash });
    return res.status(201).json({ message: 'user created' });
  }

  async login(req, res) {
    const { username, password } = req.body;
    const user = this.users.get(username);
    if (!user) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'invalid credentials' });
    }
    const token = jwt.sign({ username }, this.secret, { expiresIn: '1h' });
    return res.json({ token });
  }

  authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'missing authorization header' });
    }
    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = jwt.verify(token, this.secret);
      req.user = payload;
      return next();
    } catch (err) {
      return res.status(401).json({ error: 'invalid or expired token' });
    }
  }
}

module.exports = AuthSDK;
