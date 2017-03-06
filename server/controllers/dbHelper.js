'use strict'

const Schema = require('./dbSchema');

let dbHelper = {
    addToDB: function (body) {
      let schema = new Schema();
      let cityState = body.city.split(', ');
      let data = {
        email: body.email,
        city: cityState[0],
        state: cityState[1]
      };
      // Add a new email or allow a user to change their city
      return Schema.findOneAndUpdate({email: data.email}, data, {upsert: true, new: true}).exec();
    },
    retrieve: function () {
      return Schema.find({}).exec();
    }
};

module.exports = dbHelper;
