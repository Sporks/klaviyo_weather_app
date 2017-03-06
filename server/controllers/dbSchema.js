'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


let userSchema = new Schema({
  email: String,
  city:  String,
  state: String
});

module.exports = mongoose.model('user', userSchema);
