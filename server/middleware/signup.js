'use strict'

const dbHelper = require('../controllers/dbHelper');
const fileReader = require('../controllers/fileReader');
const isEmail = require('validator/lib/isEmail');
const wunderground = require('../middleware/wunderground');

let signup = {
  add: function (req, res, next) {
    // Split up body to an object for the city, state, and email
    // Also replace whitespaces with _ (for ease of use with API)
    let cityState = req.body.city.split(', ');
    let data = {
      email: req.body.email,
      city: cityState[0].replace(/\s/g, '_'),
      state: cityState[1]
    };
    /* Add or overwrite a new email and the corresponding city */
    dbHelper.addToDB(data).then(function(data) {
      next();
    });
  },

  retrieve: function(req, res, next){
    let users = dbHelper.retrieve();
    let promises = [];
    res.users = [];
    users.then( function(data) {
      data.forEach(user => {
        promises.push(wunderground.getToday(user.state, user.city));
        promises.push(wunderground.getHistorical(user.state, user.city));
        });
      // Wait till all promises are filled. then map 2x size array onto user array
      Promise.all(promises).then(function(vals) {
        res.users = data.map(function(current, index) {
          let newUser = {};
          newUser.email = current.email;
          newUser.city = current.city;
          newUser.state = current.state;
          newUser.average = vals[index*2+1].average;
          newUser.conditions = vals[index*2].conditions;
          newUser.temp = vals[index*2].temp;
          return newUser;
        });
        next();
      }).catch(function(e){
        // something went wrong, just move on
        console.log(e);
      });
    });
  },

  /* Validate the city and email */
  validate: function (req, res, next) {
    //Set validator to allow non english utf8 characters
    let emailOptions = {allow_utf8_local_part: true};
    let cities = JSON.parse(fileReader.read('./server/cities.json'));

    let cityState = req.body.city;
    let email = req.body.email;

    // First check if city exists with a simple map / filter then validate email
    let boolCities = cities.map(city => city.city).filter(city => city === cityState).length === 1;

    if (boolCities || isEmail(email, emailOptions)){
      // Move on to add to the database
      next();
    }
    else {
      // Fail silently and/or bring up a modal on the client
      res.sendStatus(400);
    }
  }
};


module.exports = signup;
