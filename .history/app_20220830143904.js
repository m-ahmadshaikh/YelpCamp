const express = require('express');
const path = require('path');
const app = express();

app.set('views');

app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/', (req, res) => {
  res.send('Yelp Camp!!');
});
