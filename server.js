//given file
//dependencies from package.json
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

//PORT boiler for heroku later
const PORT = process.env.PORT || 3131;

//express app
const app = express();

//Middleare for morgan dependency
app.use(logger("dev"));

// Middleware for compression, parsing JSON and urlencoded form data
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/budget", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

// routes
app.use(require("./routes/api.js"));

//app listener for connection
app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
