'use strict'
const apiKey = process.env.apiKey || require('./../key.js').apiKey;

const rp = require('request-promise-native');

let wunderground = {

  getToday: function (state, city){
    let options = {
      uri: 'http://api.wunderground.com/api/' + apiKey + '/conditions/q/' + state + '/' + city + '.json',
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(options)
      .then(function(data) {
        let weather = {conditions: '', temp: '', city: city, state: state};
        weather.conditions = data.current_observation.weather;
        weather.temp = data.current_observation.temp_f;
        return weather;
      })
      .catch( function(err) {
        console.log(err);
      });
  },

  getHistorical: function (state, city) {
    let options = {
      uri: 'http://api.wunderground.com/api/' + apiKey + '/almanac/q/' + state + '/' + city + '.json',
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true // Automatically parses the JSON string in the response
    };

    return rp(options)
      .then( function(data) {
        // Take average temp to be mean of normal high and normal low
        let average = {average: (1*data.almanac.temp_high.normal.F + 1*data.almanac.temp_low.normal.F)/2, city: city, state: state};
        return average;
      })
      .catch( function(err) {
        console.log(err);
      });
  }



};


module.exports = wunderground;
