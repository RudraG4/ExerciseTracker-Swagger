const mongoose = require('mongoose');
require('dotenv').config();

const connect = function(){
  const options = { useNewUrlParser: true, useUnifiedTopology: true };
  mongoose.connect(process.env.MONGO_URL, options);
  const connection = mongoose.connection;
  connection.on('error', ()=>{
    console.log('Error connecting to db');
  });
  return connection;
};

module.exports = { connect };