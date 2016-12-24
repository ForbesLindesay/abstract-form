const express = require('express');
const browserify = require('browserify-middleware');
const babelify = require('babelify');

const app = express();

app.get('/', (req, res, next) => {
  res.send(`
    <div id="container"></div>
    <script src="/index.js"></script>
  `);
});
app.get('/index.js', browserify(__dirname + '/index.js', {transform: [babelify]}));

app.listen(3000);
