const express = require('express');
const path = require('path');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/', (req, res) => {
  res.send('Yelp Camp!!');
});
