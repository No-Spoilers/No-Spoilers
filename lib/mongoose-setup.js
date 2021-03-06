'use strict';

const mongoose = require('mongoose');
mongoose.Promise = Promise;

// set up the URI to point to the database
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost/nospoilers';

mongoose.connect(dbURI, function(err) {
  if (err) {
    console.log('Failed connecting to Mongodb!');
  } else if(process.env.NODE_ENV != 'test') { // for testing, success should be silent
    console.log('Successfully connected to Mongodb on ' + dbURI);
  }
});

module.exports = mongoose;