'use strict'

const Schema = require('./dbSchema');

let dbHelper = {
    addToDB: function (data) {
      let schema = new Schema();
      // Add a new email or allow a user to change their city
      return Schema.findOneAndUpdate({email: data.email}, data, {upsert: true, new: true}).exec();
    },
    retrieve: function () {
      return Schema.find({}).exec();
    }
  };

module.exports = dbHelper;
