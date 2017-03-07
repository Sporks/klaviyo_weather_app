'use strict'

const path = require('path');
const express = require('express');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const webpackConfig = require('../webpack.config.js');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');

// My controllers and middleware
const signup = require('./middleware/signup');
const fileReader = require('./controllers/fileReader');
const emailer = require('./middleware/emailer');

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

// Read in the file of the most populous cities
let cities = fileReader.read('./server/cities.json');

//Use native ES6 Promises with mongoose
mongoose.Promise = Promise;
mongoose.connect( 'mongodb://wea:ther@ds119380.mlab.com:19380/weather');
const db = mongoose.connection;

db.on( 'error', console.error.bind( console, 'connection error:' ) );
db.once( 'open', function () {
	console.log( "your db is open" );
} );

app.get('/send', signup.retrieve, emailer.sendEmail, function(req, res){
  res.send("Success");
});

app.get('/index2', function(req, res){
  let file = path.join(__dirname, '../www/index2.html');
  res.sendFile(file);
});

app.get('/cities', function(req, res) {
  res.send(cities);
});

app.post('/submit', signup.validate, signup.add, function(req, res) {
  res.sendStatus(200);
});

app.listen(process.env.PORT || 8080, function(){
  console.log('Server is lisening on port 8080');
});

module.exports = app;
