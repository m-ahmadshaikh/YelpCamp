const express = require('express');
const router = express.Router();

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const user = new DefaultUser({ username: 'user' });
  await user.setPassword('password');
  await user.save();
  res.send(req.body);
});

module.exports = router;
