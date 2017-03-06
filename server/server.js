'use strict'

const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const signup = require('./middleware/signup');
const fs = require('fs');
const app = express();

const compiler = webpack(webpackConfig);

//Parse the body of what we get back in the post
app.use(bodyParser.urlencoded({ extended: false }));
app.use(webpackDevMiddleware(compiler, {
  hot: true,
  filename: 'bundle.js',
  publicPath: '/',
  stats: {
    colors: true,
  },
  historyApiFallback: true,
}));
app.use(express.static(__dirname + './../www'));

var cities = '';

// Read in the file of the most populous cities
try {
    cities = fs.readFileSync('./server/cities.json', 'utf8');
} catch(e) {
    console.log('Error:', e.stack);
}

//Use native ES6 Promises with mongoose
mongoose.Promise = Promise;
mongoose.connect( 'mongodb://wea:ther@ds119380.mlab.com:19380/weather');
const db = mongoose.connection;

db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', function () {
	console.log( "your db is open" );
} );


app.get('/cities', function(req, res) {
  res.send(cities);
});

app.post('/submit', signup.add, function(req, res) {
  console.log(req.body);
});

app.listen(process.env.PORT || 8080, function(){
  console.log('Server is lisening on port 8080');
});

module.exports = app;
