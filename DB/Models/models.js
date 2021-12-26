const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true
  }
});

const excersieSchema = new mongoose.Schema({
  userid: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: Number, required: true, min: [1] },
  date: {type: Date, default: Date.now }
});

module.exports.User = mongoose.model("User", userSchema);
module.exports.Exercise = mongoose.model("Exercise", excersieSchema);