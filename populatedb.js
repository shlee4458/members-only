const dotenv = require('dotenv');
const async = require('async');
const User = require("./models/user");
const Message = require("./models/message");

const mongoose = require("mongoose");
const mongoDB = `${process.env.MONGO_URI}`
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

const users = [];
const messages = [];

function userCreate(username, password, member, admin, cb) {
  userdetail = {
    username: username,
    password: password,
    member: member,
    admin: admin,
  };

  // Create an instance of the User model
  const user = new User(userdetail);

  // Save the new model instance, passing a callback
  user.save()
}

function messageCreate(title, text, timestamp, cb) {
  const someMessage = {
    title: title,
    text: text,
    timestamp: timestamp
  };

  const message = new Message(someMessage);
  message.save();
}

function createUsers(cb) {
  async.series([
    function(callback) {
      userCreate("GiornoGiovanna", "K2Vw@PQvV-nMS_Rf", false, false, callback);
    },
    function(callback) {
      userCreate("GuidoMista", "@4JFDq*-u^5uy!", false, false, callback);
    },
  ], cb);
}

function createMessages(cb) {
  async.series([
    function(callback) {
      messageCreate("My name is Giorno Giovanna", "I have a dream!", Date.now(), callback);
    },
    function(callback) {
      messageCreate("I'm Guido Mista", "Numbaaa 5!!", Date.now(), callback);
    },
  ], cb);
}

async.series([
  createUsers,
  createMessages,
], (err, results) => {
  if (err) { 
    console.log(`FINAL ERR: ${err}`);
  } else {
    console.log(`Success: ${results}`);
  }
  mongoose.connection.close();
});