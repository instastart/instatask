
/*
  This script will initialize a local Mongo database
  on your machine so you can do development work.

  IMPORTANT: You should make sure the

      local_database_name

  variable matches its value in app.js  Otherwise, you'll have
  initialized the wrong database.
*/

var mongoose = require('mongoose');
var models   = require('./models');

// Connect to the Mongo database, whether locally or on Heroku
// MAKE SURE TO CHANGE THE NAME FROM 'lab7' TO ... IN OTHER PROJECTS
var local_database_name = 'instatask';
var local_database_uri  = 'mongodb://localhost/' + local_database_name
var database_uri = process.env.MONGOLAB_URI || local_database_uri
mongoose.connect(database_uri);


// Do the initialization here

// Step 1: load the JSON data

// Step 2: Remove all existing documents
models.Project.remove({}, onceClear3);


 function onceClear3(err) {
    if(err) console.log(err);

    models.User.remove({}, onceClear2);
 }

  function onceClear2(err) {
    if(err) console.log(err);

    models.Task.remove({}, onceClear);
 }

// Step 3: load the data from the JSON file
function onceClear(err) {
  if(err) console.log(err);

  mongoose.connection.close()
}

