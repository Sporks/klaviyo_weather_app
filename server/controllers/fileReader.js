'use strict'
const fs = require('fs');

let fileReader = {
  read: function(filePath) {
    // Read in the file of the most populous cities
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch(e) {
        console.log('Error:', e.stack);
    }
  }


};
module.exports = fileReader;
