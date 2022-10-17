"use strict";

const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect(
    process.env["MONGO_URL"] || "mongodb://localhost:27777/todo-db",
    {
      useNewUrlParser: true,
      autoIndex: false,
    }
  );
}

module.exports = connect;
