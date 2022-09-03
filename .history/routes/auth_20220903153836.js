const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.rende('Register!');
});

module.exports = router;
