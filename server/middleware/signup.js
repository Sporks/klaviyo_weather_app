'use strict'

const dbHelper = require('../controllers/dbHelper');

let signup = {
  add: function (req, res, next) {
    /* Add or overwrite a new email and the corresponding city */
    dbHelper.addToDB(req.body).then(function(data) {
      next();
    });
  },

  /* Validate the city and email */
  validate: function (req, res, next) {

  }
};
module.exports = signup;
