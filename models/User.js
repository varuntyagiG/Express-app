const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const passportlocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  username: {
    type: String,
  },
});

// User.plugin(passportlocalMongoose);

module.exports = mongoose.model("User", userSchema);
