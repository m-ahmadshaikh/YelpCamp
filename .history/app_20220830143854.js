const express = require('express');

const app = express();

app.set('vies')

app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/', (req, res) => {
  res.send('Yelp Camp!!');
});
