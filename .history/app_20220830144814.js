const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  console.log('')
}

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {
  console.log('Listening at 3000');
});

app.get('/', (req, res) => {
  res.render('home');
});
