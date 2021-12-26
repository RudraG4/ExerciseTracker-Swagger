const express = require('express');
var mongoutil = require("../DB/mongo-util");
var mongoose = require("mongoose");
var { User, Exercise } = require("../DB/Models/models");
var routers = express.Router();

/** Add a new User */
routers.post("/", async (req, res) => {
  if (!req.body.username) {
    return res.send("Parameter `username` is required.");
  }
  const userObj = { username: req.body.username };
  let connnection;
  try {
    connection = mongoutil.connect();
    var userdetails = await User.findOne(userObj);
    if (userdetails) {
      res.json(userdetails);
    } else {
      res.json(await new User(userObj).save());
    }
  } catch (e) {
    res.status(500).json({ "error": "Server Error" });
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

/** Get Users */
routers.get("/", async (req, res) => {
  let connnection;
  try {
    connection = mongoutil.connect();
    res.json(await User.find({}));
  } catch (e) {
    res.status(500).json({ "error": "Server Error" });
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

/** Add a new user exercise */
routers.post("/:_id/exercises", async (req, res) => {
  let _id = req.params._id;
  let { description, duration, date } = req.body;
  if (!description) {
    return res.send("Parameter `description` is required.");
  }
  if (!duration) {
    return res.send("Parameter `duration` is required.");
  }
  if (isNaN(duration)) {
    return res.send("Cast to Number failed for duration value '" + duration + "'");
  }
  if (date && new Date(date).toString() == "Invalid Date") {
    return res.send("Cast to Date failed for date value '" + date + "'");
  }
  date = (date ? new Date(date) : new Date()).toDateString();
  duration = parseInt(duration, 10);
  _id = mongoose.Types.ObjectId(_id);
  let connnection;
  try {
    connection = mongoutil.connect();
    let userdetails = await User.findById(_id).exec();
    if (!userdetails) {
      return res.send(`User not found`);
    } else {
      let resp = await new Exercise({ userid: _id, description, duration, date }).save();
      res.status(200).json({
        "_id": userdetails._id,
        "username": userdetails.username,
        description,
        duration,
        date
      });
    }
  } catch (e) {
    res.status(500).json({ "error": "Server Error" });
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

/** Query user's exercise logs */
routers.get("/:_id/logs", async (req, res) => {
  const _id = req.params._id;
  const { from, to, limit } = req.query;
  let connnection;
  try {
    connection = mongoutil.connect();
    let user = await User.findById(_id).exec();
    if (!user) {
      return res.send(`User doesnot exists`);
    } else {
      let query = Exercise.find({ userid: _id });
      if (from || to) {
        query = query.where('date');
        if (from) {
          query = query.gte(new Date(from).toISOString());
        }
        if (to) {
          query = query.lte(new Date(to).toISOString());
        }
      }
      let logs = await query
        .select(["description", "duration", "date"])
        .limit(+limit)
        .sort("date")
        .exec();
      let exerciseLog = { _id: user._id, username: user.username };
      exerciseLog.log = logs.map((log) => {
        return {
          description: log.description,
          duration: log.duration,
          date: new Date(log.date).toDateString()
        };
      });
      exerciseLog.count = exerciseLog.log.length;
      res.status(200).json(exerciseLog);
    }
  } catch (e) {
    res.status(500).json({ "error": "Server Error " });
  } finally {
    if (connection) {
      connection.close();
    }
  }
});

module.exports = routers;