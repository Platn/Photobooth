// Doing stuff with a database in Node.js
var express = require('express');

// Table was created with:
// CREATE TABLE PhotoLabels (fileName TEXT UNIQUE NOT NULL PRIMARY KEY, labels TEXT, favorite INTEGER)

var sqlite3 = require("sqlite3").verbose(); // use sqlite
var dbFile = "photos.db"
var db = new sqlite3.Database(dbFile); // new object, old DB


// SERVER CODE
// Handle request to add a label
var querystring = require('querystring'); // handy for parsing query strings

function answer(query, response) {
  // query looks like: op=add&img=[image filename]&label=[label to add]
  queryObj = querystring.parse(query);

  if (queryObj.op == "add") {
    console.log("Add Function");
    var newLabel = queryObj.label;
    var imageFile = queryObj.img;
    if (newLabel && imageFile) {
      // good add query
      // go to database!
      db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [imageFile], getCallback);

      // callback for db.get
      // defined inside answer so it knows about imageFile
      // because closure!
      function getCallback(err, data) {
        console.log("getting labels from " + imageFile);
        if (err) {
          console.log("error: ", err, "\n");
        } else {
          // good response...so let's update labels
          db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ?', [data.labels + ", " + newLabel, imageFile], updateCallback);
        }
      }

      // callback for db.run('UPDATE ..')
      // Also defined inside answer so it knows about
      // response object
      function updateCallback(err) {
        console.log("updating labels for " + imageFile + "\n");
        if (err) {
          console.log(err + "\n");
          sendCode(400, response, "requested photo not found");
        } else {
          // send a nice response back to browser
          sendCode(200, response, "added label " + newLabel +
            " to " + imageFile);
        }
      }
    }
  } else if (queryObj.op == "obtain") {
    // console.log("Inside Obtain Function");
    var imageFile = queryObj.img;

    if (imageFile) {
      db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [imageFile], getCall);

      function getCall(err, data) {
        // console.log("getting labels for " + imageFile + "\n");
        if (err) {
          console.log(err + "\n");
          sendCode(400, response, "requested photo not found");
        } else {
          // send a nice response back to browser
          //              sendCode(200,response,"Obtained labels from " + imageFile);
          // console.log("Obtained labels from database");
          // console.log("Data labels = " + data.labels);
          //              console.log("Data labels = " );
          //              console.log(data.labels);
          response.send(data.labels);

        }
      }
    }
  } else if (queryObj.op == "delete") {

    var deleteLabel = queryObj.label;
    var imageFile = queryObj.img;
    console.log("Inside Delete Function");
    if (deleteLabel && imageFile) {
      // good add query
      // go to database!
      db.get('SELECT labels FROM photoLabels WHERE fileName = ?', [imageFile], getLabelsCallback);

      // callback for db.get
      // defined inside answer so it knows about imageFile
      // because closure!
      function getLabelsCallback(err, data) {
        console.log("getting labels from " + imageFile);
        if (err) {
          console.log("error: ", err, "\n");
        } else {
          // good response...so let's update labels
          var labelData = data.labels;
          console.log("labelData = " + labelData);
          console.log("DeleteLabel:" + deleteLabel);
          var newLabels = data.labels.replace(deleteLabel + ",", "");
          console.log(newLabels);
          db.run('UPDATE photoLabels SET labels = ? WHERE fileName = ?', [newLabels, imageFile], updateCallback);
        }
      }

      // callback for db.run('UPDATE ..')
      // Also defined inside answer so it knows about
      // response object
      function updateCallback(err) {
        console.log("updating labels for " + imageFile + "\n");
        if (err) {
          console.log(err + "\n");
          sendCode(400, response, "Label or image not found");
        } else {
          // send a nice response back to browser
          sendCode(200, response, "Deleted label " + newLabel +
            " to " + imageFile);
        }
      }

    }
  } else if (queryObj.op == "dump") {
    console.log("Dump Function");
    db.all('SELECT * FROM photoLabels', dataCallback);

    function dataCallback(err, tableData) {
      if (err) {
        console.log(err + "\n");
        sendCode(400, response, "Database information not found, cannot be dumped");
      } else {
        console.log("Database information sent");
        var tableStr = JSON.stringify(tableData);
        //                console.log("tableData = " + tableStr);
        sendCode(200, response, tableStr);
      }
    }
  } else if (queryObj.op == "filter") {
    var label = queryObj.label;
    // console.log("in filter, label = " + label);

    db.all('SELECT * FROM photoLabels WHERE labels LIKE  ?', ["%" + label + "%"], filterCallback);

    function filterCallback(err, data) {
      // console.log("getting labels from " + imageFile);
      if (err) {
        console.log("error: ", err, "\n");
      } else {
        // console.log("data" + data);
        var dataStr = JSON.stringify(data);
        console.log("dataStr = " + dataStr);
        sendCode(200, response, dataStr);
      }
    }
  } else if (queryObj.op == "favorite") {
    db.all('SELECT * FROM photoLabels WHERE favorite = 1', favCallback);

    function favCallback(err, data) {
      // console.log("getting labels from " + imageFile);
      if (err) {
        console.log("error: ", err, "\n");
      } else {
        // console.log("data" + data);
        var dataStr = JSON.stringify(data);
        console.log("dataStr = " + dataStr);
        sendCode(200, response, dataStr);
      }
    }
  }
}


function sendCode(code, response, message) {
  response.status(code);
  response.send(message);
}

// show just the answer function when this file is included as a module
exports.answer = answer;
