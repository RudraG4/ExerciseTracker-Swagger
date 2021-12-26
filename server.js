require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

// app.use(cors());
app.use("/Public", express.static(__dirname + "/Public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const exercise = require("./Controller/exercise");

if (!process.env.DISABLE_XORIGIN) {
  app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
}

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/Views/index.html");
});

app.use("/api/users", exercise);

const listener = app.listen(process.env.PORT || 3400, function() {
  console.log("Exercise tracker running on " + listener.address().port);
});