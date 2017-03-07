'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  email: String,
  city:  String,
  state: String
});

// Was going to add the weather to the database too
let citySchema = new Schema({
  city: String,
  state: String,
  temp_f: String,
  condition: String,
  historical: String
});

module.exports = mongoose.model('user', userSchema);
